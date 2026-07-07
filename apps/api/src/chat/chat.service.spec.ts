import { ChatService } from './chat.service';

/**
 * Tests for the circuit breaker logic in ChatService.
 * We test the private methods via their observable effects on classifyIntent.
 */
describe('ChatService — Circuit Breaker', () => {
  let service: ChatService;
  let mockAnthropicCreate: jest.Mock;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-api-key'),
  };
  const mockConversationModel = { findById: jest.fn(), create: jest.fn() };
  const mockMessageModel = { find: jest.fn(), create: jest.fn() };
  const mockCatalogModel = { find: jest.fn() };
  const mockRedis = { get: jest.fn(), set: jest.fn() };

  beforeEach(() => {
    jest.useFakeTimers();

    // Construct service with mocks using Object.create to bypass NestJS DI
    service = Object.create(ChatService.prototype);
    (service as any).configService = mockConfigService;
    (service as any).conversationModel = mockConversationModel;
    (service as any).messageModel = mockMessageModel;
    (service as any).catalogModel = mockCatalogModel;
    (service as any).redis = mockRedis;
    (service as any).isMock = false;
    (service as any).circuitBreaker = { failures: 0, lastTripTime: 0 };
    (service as any).FAILURE_THRESHOLD = 5;
    (service as any).COOLDOWN_MS = 60000;

    // Mock Anthropic client
    mockAnthropicCreate = jest.fn();
    (service as any).anthropic = {
      messages: { create: mockAnthropicCreate },
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return classified intent on successful API call', async () => {
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: 'text', text: '{"category":"complaint","detectedLanguage":"hi"}' }],
    });

    const result = await service.classifyIntent('My road has potholes');
    expect(result.category).toBe('complaint');
    expect(result.detectedLanguage).toBe('hi');
  });

  it('should fallback to general on API failure and increment failure count', async () => {
    mockAnthropicCreate.mockRejectedValue(new Error('API timeout'));

    const result = await service.classifyIntent('test');
    expect(result.category).toBe('general');
    expect((service as any).circuitBreaker.failures).toBe(1);
  });

  it('should trip circuit after 5 consecutive failures', async () => {
    mockAnthropicCreate.mockRejectedValue(new Error('API down'));

    for (let i = 0; i < 5; i++) {
      await service.classifyIntent('test');
    }

    expect((service as any).circuitBreaker.failures).toBe(5);
    expect((service as any).circuitBreaker.lastTripTime).toBeGreaterThan(0);

    // 6th call should not even hit the API
    mockAnthropicCreate.mockClear();
    const result = await service.classifyIntent('test');
    expect(mockAnthropicCreate).not.toHaveBeenCalled();
    expect(result.category).toBe('general');
  });

  it('should reset circuit after cooldown period elapses', async () => {
    // Trip the circuit
    mockAnthropicCreate.mockRejectedValue(new Error('down'));
    for (let i = 0; i < 5; i++) {
      await service.classifyIntent('test');
    }

    // Advance time past cooldown
    jest.advanceTimersByTime(61000);

    // Next call should try the API again
    mockAnthropicCreate.mockClear();
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: 'text', text: '{"category":"scheme_lookup","detectedLanguage":"en"}' }],
    });

    const result = await service.classifyIntent('pension eligibility');
    expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
    expect(result.category).toBe('scheme_lookup');
    expect((service as any).circuitBreaker.failures).toBe(0); // reset on success
  });

  it('should reset failure count on successful call', async () => {
    mockAnthropicCreate.mockRejectedValue(new Error('flaky'));
    await service.classifyIntent('test'); // failure 1
    await service.classifyIntent('test'); // failure 2

    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: 'text', text: '{"category":"general","detectedLanguage":"en"}' }],
    });
    await service.classifyIntent('test'); // success → reset
    expect((service as any).circuitBreaker.failures).toBe(0);
  });
});

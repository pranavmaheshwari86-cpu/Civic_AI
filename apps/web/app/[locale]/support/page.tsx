import React from 'react';

export default function SupportPage() {
  return (
    <div className="flex-grow pt-[104px] pb-xl flex flex-col gap-xl max-w-container-max mx-auto w-full px-gutter min-h-screen">
      <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/30 mt-8 text-center max-w-2xl mx-auto w-full">
        <span className="material-symbols-outlined text-6xl text-primary mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
        <h1 className="text-display-sm font-display-sm text-on-surface font-bold mb-4">Support Center</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">
          The Support Center is currently under construction. Please check back soon or use the AI Assistant for immediate help.
        </p>
      </div>
    </div>
  );
}

const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'apps', 'web', 'app', '[locale]', 'schemes', 'page.tsx');

let code = fs.readFileSync(targetFile, 'utf8');

// 1. Add imports
const importsToAdd = `
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
`;
code = code.replace(
  "import { useReducedMotion } from '@/lib/useReducedMotion';",
  "import { useReducedMotion } from '@/lib/useReducedMotion';\n" + importsToAdd
);

// 2. Refactor SchemeCardSkeleton
const newSkeleton = `function SchemeCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-1.5 w-full bg-muted" />
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="h-5 bg-muted rounded-full w-20" />
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="flex gap-3 mt-4">
          <div className="h-10 bg-muted rounded-xl flex-1" />
          <div className="h-10 bg-muted rounded-xl flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}`;
code = code.replace(/function SchemeCardSkeleton\(\) \{[\s\S]*?\}\n/, newSkeleton + '\n');

// 3. Search Bar Refactor
const searchBarRegex = /<m\.div\s+initial=\{\{ opacity: 0, y: 12 \}\}\s+animate=\{\{ opacity: 1, y: 0 \}\}\s+transition=\{\{ duration: 0\.45, delay: 0\.08 \}\}\s+className="relative max-w-3xl mx-auto mb-md group"\s*>[\s\S]*?<\/m\.div>/;
code = code.replace(
  searchBarRegex,
  `<m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="relative max-w-3xl mx-auto mb-md group"
            >
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition duration-500 pointer-events-none" />
              <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-ambient p-1.5 focus-within:border-primary transition-all">
                <Search className="ml-4 mr-2 text-primary w-5 h-5 flex-shrink-0" aria-hidden />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={cn(
                    'border-0 shadow-none focus-visible:ring-0',
                    isStale && 'opacity-70'
                  )}
                  placeholder="Tell me what you need... e.g. 'health scheme for rural farmers'"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="mr-2"
                  >
                    ✕
                  </Button>
                )}
                <Button className="hidden sm:inline-flex rounded-xl">
                  Search
                </Button>
              </div>
            </m.div>`
);

// 4. Quick tags refactor
code = code.replace(
  /\{QUICK_TAGS\.map\(\(tag\) => \([\s\S]*?<\/button>\s*\)\)\}/,
  `{QUICK_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary hover:text-secondary-foreground transition-all px-3 py-1 rounded-full text-sm font-medium"
                  onClick={() => setQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}`
);
code = code.replace(
  /<span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">Try:<\/span>/,
  `<span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Try:</span>`
);

// 5. Category Pills Refactor
code = code.replace(
  /\{CATEGORIES\.map\(\(cat\) => \([\s\S]*?<\/button>\s*\)\)\}/,
  `{CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  className="rounded-full px-6 py-2"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}`
);

// 6. Empty State Refactor
code = code.replace(
  /<div className="flex flex-col items-center justify-center py-\[15vh\] text-center max-w-lg mx-auto">[\s\S]*?<\/div>\s*<\/div>/,
  `<EmptyState
                icon={Search}
                title="No direct matches found"
                description={\`We couldn't find exact schemes for "\${query}". Don't worry—our AI Assistant can help you discover hidden benefits based on your specific situation.\`}
                action={{
                  label: "Ask AI",
                  href: \`/\${language}/chat\`,
                  icon: MessageSquare
                }}
                onClear={() => setQuery('')}
              />`
);

// 7. Schemes Grid Refactor
code = code.replace(
  /\{data\?\.map\(\(item, i\) => \([\s\S]*?\)\)\}/,
  `{data?.map((item, i) => (
                  <m.div
                    key={item._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={motionTransition ?? { delay: i * 0.04 }}
                    className="flex"
                  >
                    <Card className="flex flex-col w-full hover:shadow-ambient hover:border-primary/20 transition-all duration-300 group cursor-pointer overflow-hidden">
                      <div className={cn('h-1.5 w-full transition-all duration-300', i === 0 ? 'bg-primary' : 'bg-muted group-hover:bg-primary/40')} />
                      
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={i === 0 ? "default" : "secondary"} className="uppercase text-xs font-semibold">
                            {i === 0 ? <CheckCircle className="w-3 h-3 mr-1" /> : <Info className="w-3 h-3 mr-1" />}
                            {i === 0 ? '98% Match' : 'Match'}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-muted-foreground hover:text-primary">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-primary uppercase mb-2">
                          {item.type === 'scheme' ? <BookOpen className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                          {item.type}
                        </div>
                        <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="flex-1 pb-4">
                        <CardDescription className="line-clamp-2 text-base">
                          {item.description}
                        </CardDescription>
                      </CardContent>

                      <CardFooter className="flex flex-col items-start gap-4 pt-0">
                        <Badge variant="outline" className="uppercase text-xs font-semibold bg-muted/50 truncate max-w-full">
                          {item.department}
                        </Badge>
                        <div className="flex w-full gap-3 mt-2">
                          <Button variant="outline" className="flex-1 rounded-xl">
                            View Details
                          </Button>
                          <Button variant="default" className="flex-1 rounded-xl shadow-sm hover:scale-[1.02] active:scale-95 transition-all">
                            Quick Apply
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </m.div>
                ))}`
);

fs.writeFileSync(targetFile, code);
console.log('Refactored Schemes Page');

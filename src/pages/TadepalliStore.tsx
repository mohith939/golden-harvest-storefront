import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tadepalliProducts, tadepalliCategories } from '@/data/tadepalliProducts';

const TadepalliStore = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = tadepalliProducts;

    if (categoryFilter !== 'all') {
      filtered = tadepalliProducts.filter(p => p.category === categoryFilter);
    }

    const sorted = [...filtered];
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }, [categoryFilter, sortBy]);

  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 drop-shadow-sm animate-fade-in">
            Our Tadepalli Store
          </h1>
          <p className="text-foreground text-lg max-w-2xl">
            Browse the products available at our Tadepalli store. Every item is priced at ₹300/-.
            Pick a product and order instantly on WhatsApp.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-delay-2">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block text-foreground">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {tadepalliCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block text-foreground">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-delay-3">
          {filteredAndSortedProducts.map((product) => (
            <Link key={product.id} to={`/tadepalli-store/${product.id}`}>
              <Card className="h-full hover:shadow-md hover:scale-105 transition-all duration-300 border-muted bg-muted/50 group">
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-lg font-semibold text-primary mb-2">{product.name}</h3>
                  <p className="text-sm text-foreground/70 mb-4">Available at our Tadepalli store</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-primary font-bold">₹{product.price}/-</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TadepalliStore;

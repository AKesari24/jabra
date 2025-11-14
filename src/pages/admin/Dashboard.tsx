import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, Plus, LogOut, Edit, X } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    description: '',
    price_inr: '',
    price_usd: '',
    price_eur: '',
    category_id: '',
    image_url: '',
    is_featured: false,
    is_sold_out: false,
    stock_quantity: '0',
    sku: '',
  });
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    if (!roles) {
      navigate('/admin');
    }
  };

  const loadData = async () => {
    const [productsRes, categoriesRes, inquiriesRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (inquiriesRes.data) setInquiries(inquiriesRes.data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update({
          ...newProduct,
          price_inr: parseFloat(newProduct.price_inr),
          price_usd: parseFloat(newProduct.price_usd),
          price_eur: parseFloat(newProduct.price_eur),
          stock_quantity: parseInt(newProduct.stock_quantity),
        })
        .eq('id', editingProduct.id);

      if (error) {
        toast.error('Failed to update product');
        return;
      }

      toast.success('Product updated successfully');
      setEditingProduct(null);
    } else {
      const { error } = await supabase.from('products').insert({
        ...newProduct,
        price_inr: parseFloat(newProduct.price_inr),
        price_usd: parseFloat(newProduct.price_usd),
        price_eur: parseFloat(newProduct.price_eur),
        stock_quantity: parseInt(newProduct.stock_quantity),
      });

      if (error) {
        toast.error('Failed to add product');
        return;
      }

      toast.success('Product added successfully');
    }

    setNewProduct({
      name: '',
      slug: '',
      description: '',
      price_inr: '',
      price_usd: '',
      price_eur: '',
      category_id: '',
      image_url: '',
      is_featured: false,
      is_sold_out: false,
      stock_quantity: '0',
      sku: '',
    });
    loadData();
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from('categories').insert(newCategory);

    if (error) {
      toast.error('Failed to add category');
      return;
    }

    toast.success('Category added successfully');
    setNewCategory({ name: '', slug: '', description: '' });
    loadData();
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price_inr: product.price_inr.toString(),
      price_usd: product.price_usd.toString(),
      price_eur: product.price_eur.toString(),
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      is_featured: product.is_featured || false,
      is_sold_out: product.is_sold_out || false,
      stock_quantity: product.stock_quantity?.toString() || '0',
      sku: product.sku || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      slug: '',
      description: '',
      price_inr: '',
      price_usd: '',
      price_eur: '',
      category_id: '',
      image_url: '',
      is_featured: false,
      is_sold_out: false,
      stock_quantity: '0',
      sku: '',
    });
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete product');
      return;
    }
    toast.success('Product deleted');
    loadData();
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete category');
      return;
    }
    toast.success('Category deleted');
    loadData();
  };

  const handleDeleteInquiry = async (id: string) => {
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete inquiry');
      return;
    }
    toast.success('Inquiry deleted');
    loadData();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        required
                        value={newProduct.slug}
                        onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                        placeholder="product-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price_inr">Price (INR) *</Label>
                      <Input
                        id="price_inr"
                        type="number"
                        step="0.01"
                        required
                        value={newProduct.price_inr}
                        onChange={(e) => setNewProduct({ ...newProduct, price_inr: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_usd">Price (USD) *</Label>
                      <Input
                        id="price_usd"
                        type="number"
                        step="0.01"
                        required
                        value={newProduct.price_usd}
                        onChange={(e) => setNewProduct({ ...newProduct, price_usd: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_eur">Price (EUR) *</Label>
                      <Input
                        id="price_eur"
                        type="number"
                        step="0.01"
                        required
                        value={newProduct.price_eur}
                        onChange={(e) => setNewProduct({ ...newProduct, price_eur: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      const inr = parseFloat(newProduct.price_inr) || 0;
                      setNewProduct({
                        ...newProduct,
                        price_usd: (inr / 83).toFixed(2),
                        price_eur: (inr / 90).toFixed(2)
                      });
                    }}
                  >
                    Convert INR to USD & EUR
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock_quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        placeholder="SKU-001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newProduct.category_id}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        value={newProduct.image_url}
                        onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={newProduct.is_featured}
                        onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="is_featured" className="cursor-pointer">Featured Product</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_sold_out"
                        checked={newProduct.is_sold_out}
                        onChange={(e) => setNewProduct({ ...newProduct, is_sold_out: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="is_sold_out" className="cursor-pointer">Sold Out</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      <Plus className="mr-2 h-4 w-4" />
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                    {editingProduct && (
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Products ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price (INR)</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku || 'N/A'}</TableCell>
                        <TableCell>{product.categories?.name || 'N/A'}</TableCell>
                        <TableCell>₹{product.price_inr}</TableCell>
                        <TableCell>{product.stock_quantity}</TableCell>
                        <TableCell>
                          {product.is_sold_out ? (
                            <span className="text-destructive">Sold Out</span>
                          ) : product.is_featured ? (
                            <span className="text-primary">Featured</span>
                          ) : (
                            <span className="text-muted-foreground">Active</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cat_name">Category Name *</Label>
                      <Input
                        id="cat_name"
                        required
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cat_slug">Slug *</Label>
                      <Input
                        id="cat_slug"
                        required
                        value={newCategory.slug}
                        onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                        placeholder="category-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cat_description">Description</Label>
                    <Textarea
                      id="cat_description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    />
                  </div>

                  <Button type="submit">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Categories ({categories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>{category.description || 'N/A'}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Inquiries ({inquiries.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product/Items</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell>{new Date(inquiry.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">
                          {inquiry.product_name}
                          {inquiry.cart_items && inquiry.cart_items.length > 0 && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              {inquiry.cart_items.map((item: any, idx: number) => (
                                <div key={idx}>
                                  {item.name} × {item.quantity}
                                </div>
                              ))}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{inquiry.name}</TableCell>
                        <TableCell>{inquiry.email}</TableCell>
                        <TableCell>{inquiry.phone}</TableCell>
                        <TableCell>{inquiry.company || 'N/A'}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteInquiry(inquiry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

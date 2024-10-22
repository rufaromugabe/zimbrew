"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { Coffee, Minus, Plus, ShoppingCart, Star, Trash2 } from "lucide-react";
import Link from 'next/link';
import { useState } from "react";

interface Product {
  id: number
  name: string
  price: number
  rating: number
  imageUrl: string
  category: string
}

interface CartItem extends Product {
  quantity: number
}

interface CheckoutForm {
  fullName: string
  address: string
  city: string
  postalCode: string
  cardNumber: string
  cardExpiry: string
  cardCVC: string
}


const products: Product[] = [
  { id: 1, name: "Espresso Blend", price: 14.99, rating: 5, imageUrl: "coffee1.jpeg", category: "Blend" },
  { id: 2, name: "Colombian Supremo", price: 16.99, rating: 4, imageUrl: "coffee2.jpeg", category: "Single Origin" },
  { id: 3, name: "Ethiopian Yirgacheffe", price: 18.99, rating: 5, imageUrl: "coffee3.jpeg", category: "Single Origin" },
  { id: 4, name: "French Roast", price: 15.99, rating: 4, imageUrl: "coffee4.jpeg", category: "Dark Roast" },
  { id: 5, name: "Decaf House Blend", price: 14.99, rating: 3, imageUrl: "coffee7.jpeg", category: "Decaf" },
  { id: 6, name: "Costa Rican Tarrazu", price: 17.99, rating: 4, imageUrl: "coffee6.jpeg", category: "Single Origin" },
]


export function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 20])
  const [sortOption, setSortOption] = useState("name")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(0)
  const [orderComplete, setOrderComplete] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  })

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    filterProducts(event.target.value, categoryFilter, priceRange)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    filterProducts(searchTerm, value, priceRange)
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    filterProducts(searchTerm, categoryFilter, value)
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
    sortProducts(value)
  }

  const filterProducts = (search: string, category: string, price: number[]) => {
    let filtered = products.filter(product => product.category === category);
    let sorted = filtered.sort((a, b) => a.price - b.price);
    setFilteredProducts(filtered)
    sortProducts(sortOption, filtered)
  }

  const sortProducts = (option: string, productsToSort = filteredProducts) => {
    let sorted = [...productsToSort]
    switch (option) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
    }
    setFilteredProducts(sorted)
  }

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
    toast({
      title: "Removed from cart",
      description: "The item has been removed from your cart.",
      variant: "destructive",
    })
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const startCheckout = () => {
    setIsCheckoutOpen(true)
    setCheckoutStep(0)
  }

  const handleCheckoutNext = () => {
    if (checkoutStep < 2) {
      if (validateCheckoutStep()) {
        setCheckoutStep(checkoutStep + 1)
      }
    } else {
      if (validateCheckoutStep()) {
        // Simulate payment processing
        toast({
          title: "Processing payment",
          description: "Please wait while we process your payment.",
        })
        setTimeout(() => {
          setOrderComplete(true)
          setCartItems([])
          setIsCartOpen(false)
          toast({
            title: "Order complete",
            description: "Your order has been successfully processed.",
            variant: "success",
          })
        }, 2000)
      }
    }
  }

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false)
    setCheckoutStep(0)
    setOrderComplete(false)
    setCheckoutForm({
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
    })
  }

  const validateCheckoutStep = () => {
    switch (checkoutStep) {
      case 0:
        if (!checkoutForm.fullName || !checkoutForm.address || !checkoutForm.city || !checkoutForm.postalCode) {
          toast({
            title: "Incomplete information",
            description: "Please fill in all shipping information fields.",
            variant: "destructive",
          })
          return false
        }
        break
      case 1:
        if (!checkoutForm.cardNumber || !checkoutForm.cardExpiry || !checkoutForm.cardCVC) {
          toast({
            title: "Incomplete information",
            description: "Please fill in all payment information fields.",
            variant: "destructive",
          })
          return false
        }
        // Add more specific validation for card fields if needed
        break
      case 2:
        // Final confirmation step, no additional validation needed
        break
    }
    return true
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCheckoutForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-14 items-center">
          <a className="flex items-center justify-center" href="#">
            <Coffee className="h-6 w-6 text-neutral-900 dark:text-neutral-50" />
            <span className="ml-2 text-lg font-semibold">ZimBrew</span>
          </a>
          <nav className="ml-auto flex gap-4 sm:gap-6">
  <Link href="/"legacyBehavior>
    <a className="text-sm font-medium hover:underline underline-offset-4">Home</a>
  </Link>
  <Link href="/products"legacyBehavior>
    <a className="text-sm font-medium hover:underline underline-offset-4">Shop</a>
  </Link>
  <Link href="/contact"legacyBehavior>
    <a className="text-sm font-medium hover:underline underline-offset-4">Contact</a>
  </Link>
</nav>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="ml-4 relative">
                <ShoppingCart className="h-4 w-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-neutral-900 text-neutral-50 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center dark:bg-neutral-50 dark:text-neutral-900">
                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
                <SheetDescription>
                  {cartItems.length === 0 ? "Your cart is empty" : `${cartItems.length} items in your cart`}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {cartItems.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full" onClick={startCheckout}>
                    Proceed to Checkout
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Blend">Blend</SelectItem>
                  <SelectItem value="Single Origin">Single Origin</SelectItem>
                  <SelectItem value="Dark Roast">Dark Roast</SelectItem>
                  <SelectItem value="Decaf">Decaf</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price Range</Label>
              <Slider
                min={0}
                max={20}
                step={1}
                value={priceRange}
                
                onValueChange={handlePriceChange}
              />
              <div className="flex justify-between mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white p-6 rounded-lg shadow-md">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4 rounded-md"
                  />
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.category}</p>
                  <div className="flex items-center mb-2">
                    {Array(product.rating)
                      .fill(null)
                      .map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-neutral-900 dark:text-neutral-50" />
                      ))}
                  </div>
                  <p className="text-lg font-bold mb-4">${product.price.toFixed(2)}</p>
                  <Button className="w-full" onClick={() => addToCart(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Dialog open={isCheckoutOpen} onOpenChange={handleCheckoutClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{orderComplete ? "Order Complete" : "Checkout"}</DialogTitle>
            <DialogDescription>
              {orderComplete ? "Thank you for your purchase!" : `Step ${checkoutStep + 1} of 3`}
            </DialogDescription>
          </DialogHeader>
          {!orderComplete && (
            <div className="py-4">
              {checkoutStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Shipping Information</h3>
                  <Input 
                    placeholder="Full Name" 
                    name="fullName"
                    value={checkoutForm.fullName}
                    onChange={handleInputChange}
                  />
                  <Input 
                    placeholder="Address" 
                    name="address"
                    value={checkoutForm.address}
                    onChange={handleInputChange}
                  />
                  <Input 
                    placeholder="City" 
                    name="city"
                    value={checkoutForm.city}
                    onChange={handleInputChange}
                  />
                  <Input 
                    placeholder="Postal Code" 
                    name="postalCode"
                    value={checkoutForm.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              {checkoutStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment Information</h3>
                  <Input 
                    placeholder="Card Number" 
                    name="cardNumber"
                    value={checkoutForm.cardNumber}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="MM/YY" 
                      name="cardExpiry"
                      value={checkoutForm.cardExpiry}
                      onChange={handleInputChange}
                    />
                    <Input 
                      placeholder="CVC" 
                      name="cardCVC"
                      value={checkoutForm.cardCVC}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              {checkoutStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="font-semibold flex justify-between">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
              <Button className="w-full mt-4" onClick={handleCheckoutNext}>
                {checkoutStep === 2 ? "Place Order" : "Next"}
              </Button>
            </div>
          )}
          {orderComplete && (
            <Button className="w-full mt-4" onClick={handleCheckoutClose}>
              Continue Shopping
            </Button>
          )}
        </DialogContent>
      </Dialog>
      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center py-6">
          <p className="text-sm text-gray-500">© 2024 ZimBrew. All rights reserved.</p>
          <nav className="flex gap-4 mt-4 sm:mt-0">
            <a className="text-sm text-gray-500 hover:underline" href="#">
              Terms of Service
            </a>
            <a className="text-sm text-gray-500 hover:underline" href="#">
              Privacy Policy
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
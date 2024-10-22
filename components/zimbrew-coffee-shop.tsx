"use client"
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowRight, Coffee, Minus, Plus, ShoppingCart, Star, Trash2 } from "lucide-react";
import Link from 'next/link';
import { useState } from "react";

interface Product {
  id: number
  name: string
  price: number
  rating: number
  imageUrl: string
}

interface CartItem extends Product {
  quantity: number
}

export function ZimbrewCoffeeShop() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(0)

  const products: Product[] = [
    { id: 1, name: "Espresso Blend", price: 14.99, rating: 5, imageUrl: "coffee1.jpeg" },
    { id: 2, name: "Colombian Supremo", price: 16.99, rating: 4, imageUrl: "coffee2.jpeg" },
    { id: 3, name: "Ethiopian Yirgacheffe", price: 18.99, rating: 5, imageUrl: "coffee3.jpeg" },
  ]
  

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
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
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
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
    setCheckoutStep(0)
  }

  const nextCheckoutStep = () => {
    setCheckoutStep((prev) => prev + 1)
  }

  const completeCheckout = () => {
    setTimeout(() => {
      setCartItems([])
      setIsCheckoutOpen(false)
      setCheckoutStep(0)
      alert("Thank you for your order! Your delicious coffee is on its way.")
    }, 2000)
  }

  const CheckoutContent = () => {
    switch (checkoutStep) {
      case 0:
        return (
          <>
            <SheetHeader>
              <SheetTitle>Shipping Information</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input id="address" className="col-span-3" />
              </div>
            </div>
            <SheetFooter>
              <Button onClick={nextCheckoutStep}>Next</Button>
            </SheetFooter>
          </>
        )
      case 1:
        return (
          <>
            <SheetHeader>
              <SheetTitle>Payment Method</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <RadioGroup defaultValue="card">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
              </RadioGroup>
            </div>
            <SheetFooter>
              <Button onClick={completeCheckout}>Complete Order</Button>
            </SheetFooter>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col justify-center  min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-950/95 dark:supports-[backdrop-filter]:bg-neutral-950/60">
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
          <Sheet open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <SheetContent>
              <CheckoutContent />
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[url('/bg2.jpg?height=1080&width=1920')] bg-cover bg-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Welcome to ZimBrew
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Discover the perfect blend for your daily ritual. Artisanal coffee roasted to perfection.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-white text-black hover:bg-gray-200" onClick={() => window.location.href = "/products"}>Shop Now</Button>
                <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                  width={200}
                  height={200}
                />
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  {Array(product.rating)
                    .fill(null)
                    .map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-neutral-900 dark:text-neutral-50" />
                    ))}
                </div>
                <p className="text-lg font-semibold mb-4">${product.price.toFixed(2)}</p>
                <Button className="w-full" onClick={() => addToCart(product)}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </div>
              
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Stay Brewed In</h2>
                <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Subscribe to our newsletter for exclusive offers, brewing tips, and first dibs on new arrivals.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-gray-700 text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-400">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-100">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-xs text-gray-500">© 2024 ZimBrew. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <a className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </a>
            <a className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

"use client";
import { toast } from "@/hooks/use-toast";
import { Coffee } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  imageUrl: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutForm {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Espresso Blend",
    price: 14.99,
    rating: 5,
    imageUrl: "coffee1.jpeg",
    category: "Blend",
  },
  {
    id: 2,
    name: "Colombian Supremo",
    price: 16.99,
    rating: 4,
    imageUrl: "coffee2.jpeg",
    category: "Single Origin",
  },
  {
    id: 3,
    name: "Ethiopian Yirgacheffe",
    price: 18.99,
    rating: 5,
    imageUrl: "coffee3.jpeg",
    category: "Single Origin",
  },
  {
    id: 4,
    name: "French Roast",
    price: 15.99,
    rating: 4,
    imageUrl: "coffee4.jpeg",
    category: "Dark Roast",
  },
  {
    id: 5,
    name: "Decaf House Blend",
    price: 14.99,
    rating: 3,
    imageUrl: "coffee7.jpeg",
    category: "Decaf",
  },
  {
    id: 6,
    name: "Costa Rican Tarrazu",
    price: 17.99,
    rating: 4,
    imageUrl: "coffee6.jpeg",
    category: "Single Origin",
  },
];

export function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [sortOption, setSortOption] = useState("name");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    filterProducts(event.target.value, categoryFilter, priceRange);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    filterProducts(searchTerm, value, priceRange);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    filterProducts(searchTerm, categoryFilter, value);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    sortProducts(value);
  };

  const filterProducts = (search: string, category: string, price: number[]) => {
    let filtered = products.filter((product) =>
      category === "All"
        ? product.price >= price[0] && product.price <= price[1]
        : product.category === category &&
          product.price >= price[0] &&
          product.price <= price[1]
    );

    setFilteredProducts(filtered);
    sortProducts(sortOption, filtered);
  };

  const sortProducts = (option: string, productsToSort = filteredProducts) => {
    const sorted = [...productsToSort];
    switch (option) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }
    setFilteredProducts(sorted);
  };

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
    toast({
      title: "Removed from cart",
      description: "The item has been removed from your cart.",
      variant: "destructive",
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const startCheckout = () => {
    setIsCheckoutOpen(true);
    setCheckoutStep(0);
  };

  const handleCheckoutNext = () => {
    if (checkoutStep < 2) {
      if (validateCheckoutStep()) {
        setCheckoutStep(checkoutStep + 1);
      }
    } else {
      if (validateCheckoutStep()) {
        toast({
          title: "Processing payment",
          description: "Please wait while we process your payment.",
        });
        setTimeout(() => {
          setOrderComplete(true);
          setCartItems([]);
          setIsCartOpen(false);
          toast({
            title: "Order complete",
            description: "Your order has been successfully processed.",
            variant: "success",
          });
        }, 2000);
      }
    }
  };

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
    setCheckoutStep(0);
    setOrderComplete(false);
    setCheckoutForm({
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
    });
  };

  const validateCheckoutStep = () => {
    switch (checkoutStep) {
      case 0:
        if (
          !checkoutForm.fullName ||
          !checkoutForm.address ||
          !checkoutForm.city ||
          !checkoutForm.postalCode
        ) {
          toast({
            title: "Incomplete information",
            description: "Please fill in all shipping information fields.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 1:
        if (
          !checkoutForm.cardNumber ||
          !checkoutForm.cardExpiry ||
          !checkoutForm.cardCVC
        ) {
          toast({
            title: "Incomplete information",
            description: "Please fill in all payment information fields.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        break;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-14 items-center">
          <a className="flex items-center justify-center space-x-2">
            <Coffee size={24} />
            <span className="font-bold">Coffee Shop</span>
          </a>
        </div>
      </header>
      {/* rest of the component */}
    </div>
  );
}

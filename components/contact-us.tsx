"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Coffee, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"

export function ContactUsComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData)
    alert("Thank you for your message. We'll get back to soon!")
    setFormData({ name: "", email: "", message: "" })
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
            <a className="text-sm font-medium hover:underline underline-offset-4" href="/">
              Home
            </a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="/products">
              Shop
            </a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-neutral-900 mr-2 dark:text-neutral-50" />
                  <span>Belvedere Ganges, Harare, Zimbabwe</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-neutral-900 mr-2 dark:text-neutral-50" />
                  <span>+263 779 826 816</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-neutral-900 mr-2 dark:text-neutral-50" />
                  <span>h230275r@hit.ac.zw</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Our Location</h2>
              <div className="aspect-video relative rounded-md overflow-hidden">
                <img
                  src="/map.jpg?height=400&width=600"
                  alt="Map of ZimBrew Coffee Shop location"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

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
"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Facebook,
  Instagram,
  Twitter,
  PinIcon,
  Trash2,
  Plus,
  Download,
  Upload,
  X,
  Github,
  Linkedin,
  Youtube,
  Globe,
  Mail,
  Link,
  Printer,
  MessageSquare,
  GithubIcon,
  LucideGithub,
} from "lucide-react";
import NextLink from "next/link";
import { defaultLogo } from "../constants/logo";
import Image from "next/image";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

interface SocialLink {
  id: string;
  type: string;
  url: string;
}

interface InvoiceData {
  title: string;
  logo: string;
  businessInfo: {
    name: string;
    address: string;
    city: string;
    website: string;
    email: string;
    phone: string;
  };
  invoiceInfo: {
    number: string;
    issued: string;
    due: string;
  };
  lineItems: LineItem[];
  clientInfo: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    paypal: string;
  };
  taxRate: number;
  discountRate: number;
  thankYouMessage: string;
  socialLinks: SocialLink[];
}

const defaultInvoiceData: InvoiceData = {
  title: "Invoice",
  logo: defaultLogo,
  businessInfo: {
    name: "BUSINESS NAME",
    address: "1234 YOUR ADDRESS",
    city: "CITY, 00000",
    website: "www.yourbusiness.com",
    email: "yourbusiness@email.com",
    phone: "(000)111-2222",
  },
  invoiceInfo: {
    number: "0000",
    issued: "01/01/2022",
    due: "01/01/2023",
  },
  lineItems: [
    { id: "1", description: "Your item name here", quantity: 3, price: 50 },
    { id: "2", description: "Your item name here", quantity: 2, price: 50 },
    { id: "3", description: "Your item name here", quantity: 5, price: 5 },
  ],
  clientInfo: {
    name: "CLIENT NAME",
    address: "1234 CLIENT'S ADDRESS",
    city: "CITY, 00000",
    phone: "(000)111-2222",
  },
  paymentInfo: {
    bankName: "YOUR BANK NAME",
    accountNumber: "YOUR NUMBER",
    paypal: "yourbusiness@email.com",
  },
  taxRate: 0,
  discountRate: 0,
  thankYouMessage: "Thank you!",
  socialLinks: [
    { id: "1", type: "facebook", url: "https://facebook.com" },
    { id: "2", type: "instagram", url: "https://instagram.com" },
    { id: "3", type: "twitter", url: "https://twitter.com" },
    { id: "4", type: "pinterest", url: "https://pinterest.com" },
  ],
};

const STORAGE_KEY = "invoice-editor-data";

export default function InvoiceEditor() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          return JSON.parse(savedData);
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    }
    return defaultInvoiceData;
  });
  const [activeSocialLinkId, setActiveSocialLinkId] = useState<string | null>(
    null
  );
  const invoiceRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoiceData));
      } catch (error) {
        console.error("Error saving data to localStorage:", error);
      }
    }
  }, [invoiceData]);

  const handleContentEdit = (
    e: React.FocusEvent<HTMLElement>,
    section: keyof InvoiceData | string,
    field: string
  ) => {
    const value = e.target.innerText;

    setInvoiceData((prev) => {
      const newData = { ...prev };

      if (section === "title") {
        newData.title = value;
      } else if (section === "business") {
        newData.businessInfo = { ...newData.businessInfo, [field]: value };
      } else if (section === "invoice") {
        newData.invoiceInfo = { ...newData.invoiceInfo, [field]: value };
      } else if (section === "client") {
        newData.clientInfo = { ...newData.clientInfo, [field]: value };
      } else if (section === "payment") {
        newData.paymentInfo = { ...newData.paymentInfo, [field]: value };
      } else if (section === "tax") {
        newData.taxRate = Number.parseFloat(value) || 0;
      } else if (section === "discount") {
        newData.discountRate = Number.parseFloat(value) || 0;
      } else if (section === "thankYou") {
        newData.thankYouMessage = value;
      }

      return newData;
    });
  };

  const handleLineItemEdit = (
    e: React.FocusEvent<HTMLElement>,
    id: string,
    field: keyof LineItem
  ) => {
    const value = e.target.innerText.replace("$", "");

    setInvoiceData((prev) => {
      const newLineItems = prev.lineItems.map((item) => {
        if (item.id === id) {
          if (field === "quantity" || field === "price") {
            return { ...item, [field]: Number.parseFloat(value) || 0 };
          }
          return { ...item, [field]: value };
        }
        return item;
      });

      return { ...prev, lineItems: newLineItems };
    });
  };

  const addLineItem = () => {
    setInvoiceData((prev) => {
      const newId = (
        Math.max(0, ...prev.lineItems.map((item) => Number.parseInt(item.id))) +
        1
      ).toString();
      return {
        ...prev,
        lineItems: [
          ...prev.lineItems,
          {
            id: newId,
            description: "Your item name here",
            quantity: 1,
            price: 50,
          },
        ],
      };
    });
  };

  const removeLineItem = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInvoiceData((prev) => ({
        ...prev,
        logo: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const triggerLogoUpload = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    setInvoiceData((prev) => ({
      ...prev,
      logo: "",
    }));
  };

  const addSocialLink = () => {
    setInvoiceData((prev) => {
      const newId = (
        Math.max(
          0,
          ...prev.socialLinks.map((link) => Number.parseInt(link.id))
        ) + 1
      ).toString();
      return {
        ...prev,
        socialLinks: [
          ...prev.socialLinks,
          { id: newId, type: "globe", url: "https://example.com" },
        ],
      };
    });
  };

  const removeSocialLink = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((link) => link.id !== id),
    }));
    setActiveSocialLinkId(null);
  };

  const updateSocialLink = (id: string, type: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link) =>
        link.id === id ? { ...link, type } : link
      ),
    }));
  };

  const updateSocialLinkUrl = (id: string, url: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link) =>
        link.id === id ? { ...link, url } : link
      ),
    }));
  };

  const calculateSubtotal = () => {
    return invoiceData.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  const calculateDiscount = () => {
    return calculateSubtotal() * (invoiceData.discountRate / 100);
  };

  const calculateTax = () => {
    return (
      (calculateSubtotal() - calculateDiscount()) * (invoiceData.taxRate / 100)
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const triggerPrint = () => {
    window.print();
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(invoiceData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `invoice-${invoiceData.invoiceInfo.number}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        setInvoiceData(importedData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const renderSocialIcon = (type: string) => {
    switch (type) {
      case "facebook":
        return <Facebook className="w-5 h-5 text-gray-500" />;
      case "instagram":
        return <Instagram className="w-5 h-5 text-gray-500" />;
      case "twitter":
        return <Twitter className="w-5 h-5 text-gray-500" />;
      case "pinterest":
        return <PinIcon className="w-5 h-5 text-gray-500" />;
      case "github":
        return <Github className="w-5 h-5 text-gray-500" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5 text-gray-500" />;
      case "youtube":
        return <Youtube className="w-5 h-5 text-gray-500" />;
      case "mail":
        return <Mail className="w-5 h-5 text-gray-500" />;
      default:
        return <Globe className="w-5 h-5 text-gray-500" />;
    }
  };

  // Handle click outside to close social link editor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".social-link-editor") &&
        !target.closest(".social-link-icon")
      ) {
        setActiveSocialLinkId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetToDefault = () => {
    if (
      window.confirm(
        "Are you sure you want to reset to default data? All your changes will be lost."
      )
    ) {
      setInvoiceData(defaultInvoiceData);
    }
  };

  if (!hydrated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center print:p-0 print:bg-white">
      <Card className="w-full max-w-4xl mb-4 p-4 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <NextLink
          target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSe8j6r_0mUjj57RX9RkULKztZ4Z96g_-hP1KJX6JTqKbypj3Q/viewform?usp=dialog"
        >
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Give me your feedback
          </Button>{" "}
        </NextLink>
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            accept=".json"
            onChange={importJSON}
            className="hidden"
            id="json-upload"
          />
          <label htmlFor="json-upload">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
            >
              <span>
                {" "}
                <Download className="w-4 h-4" />
                Import
              </span>
            </Button>
          </label>
          <Button
            variant="outline"
            onClick={exportToJSON}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={resetToDefault}
            className="flex items-center gap-2 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
          >
            <X className="w-4 h-4" />
            Reset
          </Button>
          <Button onClick={triggerPrint} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </Button>
        </div>
      </Card>

      <div
        ref={invoiceRef}
        className="w-full max-w-4xl bg-white p-8 md:p-12 shadow-sm font-light print:shadow-none print:max-w-none print:w-[210mm] print:p-[10mm]"
      >
        {/* Header */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h1
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit(e, "title", "")}
              className="invoice-title text-5xl md:text-6xl mb-12 tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
            >
              {invoiceData.title}
            </h1>
            <div className="space-y-3 text-sm tracking-wide">
              <div className="flex gap-2">
                <span className="text-gray-500 uppercase">INVOICE NO.</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(e, "invoice", "number")}
                  className="border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none min-w-[60px] inline-block print:border-none"
                >
                  {invoiceData.invoiceInfo.number}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 uppercase">ISSUED:</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(e, "invoice", "issued")}
                  className="border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none min-w-[80px] inline-block print:border-none"
                >
                  {invoiceData.invoiceInfo.issued}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 uppercase">DUE:</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(e, "invoice", "due")}
                  className="border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none min-w-[80px] inline-block print:border-none"
                >
                  {invoiceData.invoiceInfo.due}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-right mb-6 relative group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                className="hidden"
                accept="image/*"
              />

              {invoiceData.logo ? (
                <div className="relative inline-block">
                  <img
                    src={invoiceData.logo || "/placeholder.svg"}
                    alt="Logo"
                    className="max-h-24 max-w-full inline-block object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeLogo}
                    className="absolute top-0 right-0 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100 edit-button bg-white rounded-full print:hidden"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={triggerLogoUpload}
                  className="text-xl italic tracking-wide text-gray-400 hover:text-gray-600 edit-button print:hidden"
                >
                  Click to add logo
                </Button>
              )}
            </div>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit(e, "business", "name")}
              className="text-sm tracking-widest uppercase border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
            >
              {invoiceData.businessInfo.name}
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit(e, "business", "address")}
              className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
            >
              {invoiceData.businessInfo.address}
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit(e, "business", "city")}
              className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
            >
              {invoiceData.businessInfo.city}
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit(e, "business", "website")}
              className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
            >
              {invoiceData.businessInfo.website}
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit(e, "business", "email")}
              className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
            >
              {invoiceData.businessInfo.email}
            </p>
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentEdit(e, "business", "phone")}
              className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
            >
              {invoiceData.businessInfo.phone}
            </p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-12">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 text-sm tracking-widest uppercase text-gray-500">
                  Description
                </th>
                <th className="text-center py-3 text-sm tracking-widest uppercase text-gray-500">
                  Qty
                </th>
                <th className="text-right py-3 text-sm tracking-widest uppercase text-gray-500">
                  Price
                </th>
                <th className="text-right py-3 text-sm tracking-widest uppercase text-gray-500">
                  Total
                </th>
                <th className="w-8 print:hidden"></th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 group">
                  <td className="py-4">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleLineItemEdit(e, item.id, "description")
                      }
                      className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none inline-block min-w-[200px] print:border-none"
                    >
                      {item.description}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleLineItemEdit(e, item.id, "quantity")}
                      className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none inline-block min-w-[30px] print:border-none"
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleLineItemEdit(e, item.id, "price")}
                      className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none inline-block min-w-[50px] print:border-none"
                    >
                      ${item.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-sm tracking-wide">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 print:hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(item.id)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100 edit-button"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            variant="ghost"
            onClick={addLineItem}
            className="mt-4 text-xs flex items-center gap-1 text-gray-500 edit-button print:hidden"
          >
            <Plus className="w-3 h-3" />
            Add Item
          </Button>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-sm tracking-widest uppercase text-gray-500 mb-4">
              Billed To
            </h3>
            <div className="space-y-1">
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(e, "client", "name")}
                className="text-sm tracking-widest uppercase border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
              >
                {invoiceData.clientInfo.name}
              </p>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(e, "client", "address")}
                className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
              >
                {invoiceData.clientInfo.address}
              </p>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(e, "client", "city")}
                className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
              >
                {invoiceData.clientInfo.city}
              </p>
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleContentEdit(e, "client", "phone")}
                className="text-sm tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none print:border-none"
              >
                {invoiceData.clientInfo.phone}
              </p>
            </div>
          </div>
          <div>
            <div className="text-right space-y-3 border-b border-gray-800 pb-4">
              <div className="flex justify-between text-sm tracking-wide">
                <span className="text-gray-500 uppercase">Total Amount</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm tracking-wide">
                <span className="text-gray-500 uppercase flex items-center">
                  Discount(
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(e, "discount", "rate")}
                    className="border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none inline-block print:border-none"
                  >
                    {invoiceData.discountRate}
                  </span>
                  %)
                </span>
                <span>-${calculateDiscount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm tracking-wide">
                <span className="text-gray-500 uppercase flex items-center">
                  Tax(
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleContentEdit(e, "tax", "rate")}
                    className="border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none inline-block  print:border-none"
                  >
                    {invoiceData.taxRate}
                  </span>
                  %)
                </span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm tracking-wide mt-4">
              <span className="text-gray-500 uppercase">Amount Due</span>
              <span className="font-medium">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-sm tracking-widest uppercase text-gray-500 mb-4">
              Payment Methods
            </h3>
            <div className="space-y-2 text-sm tracking-wide">
              <div className="flex gap-2">
                <span className="text-gray-500 uppercase">Bank Name:</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(e, "payment", "bankName")}
                  className="border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none min-w-[150px] inline-block print:border-none"
                >
                  {invoiceData.paymentInfo.bankName}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 uppercase">Account Number:</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleContentEdit(e, "payment", "accountNumber")
                  }
                  className="border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none min-w-[150px] inline-block print:border-none"
                >
                  {invoiceData.paymentInfo.accountNumber}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-500 uppercase">PayPal:</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentEdit(e, "payment", "paypal")}
                  className="border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none min-w-[150px] inline-block print:border-none"
                >
                  {invoiceData.paymentInfo.paypal}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleContentEdit(e, "thankYou", "")}
            className="thank-you-text text-3xl md:text-4xl mb-8 tracking-wide border-b border-transparent hover:border-gray-200 focus:border-gray-400 focus:outline-none inline-block print:border-none"
          >
            {invoiceData.thankYouMessage}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-2">
            {invoiceData.socialLinks.map((link) => (
              <div key={link.id} className="relative">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link-icon cursor-pointer print:cursor-default"
                  onClick={(e) => {
                    // In edit mode, prevent navigation and show editor
                    if (!window.matchMedia("print").matches) {
                      e.preventDefault();
                      setActiveSocialLinkId(link.id);
                    }
                  }}
                >
                  {renderSocialIcon(link.type)}
                </a>

                {activeSocialLinkId === link.id && (
                  <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded p-2 z-10 social-link-editor print:hidden">
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <select
                          value={link.type}
                          onChange={(e) =>
                            updateSocialLink(link.id, e.target.value)
                          }
                          className="text-xs p-1 border rounded flex-1"
                        >
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter</option>
                          <option value="pinterest">Pinterest</option>
                          <option value="github">GitHub</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="youtube">YouTube</option>
                          <option value="mail">Email</option>
                          <option value="globe">Website</option>
                        </select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSocialLink(link.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) =>
                            updateSocialLinkUrl(link.id, e.target.value)
                          }
                          placeholder="https://example.com"
                          className="text-xs p-1 border rounded flex-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={addSocialLink}
              className="w-5 h-5 p-0 text-gray-500 edit-button print:hidden"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} {invoiceData.businessInfo.name}. All
            Rights Reserved.
          </p>
        </div>
      </div>

      <footer className="print:hidden mt-10">
        <div className="text-sm text-gray-500 mt-2 inline-flex items-center gap-2">
          <span>
            Made with ❤️ by{" "}
            <NextLink
              href="https://akila.cc"
              target="_blank"
              className="text-blue-600"
            >
              Akila
            </NextLink>
          </span>

          {" • "}
          <NextLink
            href="https://github.com/akilawelihinda/invoice-generator"
            target="_blank"
            className="text-blue-600 flex items-center gap-1 inline-flex"
          >
            <Image
              src="./github-mark.svg"
              width={14}
              height={14}
              alt="github logo"
            />
          </NextLink>
        </div>
      </footer>
    </div>
  );
}

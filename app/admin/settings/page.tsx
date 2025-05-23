"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    Bell,
    Building,
    CreditCard,
    Palette,
    Save,
    Shield,
    Store,
    Truck
} from 'lucide-react';
import { useState } from 'react';

interface StoreSettings {
  // Store Information
  storeName: string;
  storeDescription: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  
  // Business Settings
  currency: string;
  timezone: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  
  // Notifications
  emailNotifications: boolean;
  orderNotifications: boolean;
  inventoryNotifications: boolean;
  customerNotifications: boolean;
  
  // Security
  twoFactorAuth: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  
  // Appearance
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  
  // Payment Methods
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  creditCardEnabled: boolean;
  
  // Shipping Options
  localDelivery: boolean;
  internationalShipping: boolean;
  expressShipping: boolean;
}

const defaultSettings: StoreSettings = {
  storeName: 'Luxe Intimates',
  storeDescription: 'Premium intimate wear and luxury accessories for the modern woman',
  storeEmail: 'info@luxeintimateS.com',
  storePhone: '+1 (555) 123-4567',
  storeAddress: '123 Fashion Ave, New York, NY 10001',
  
  currency: 'USD',
  timezone: 'America/New_York',
  taxRate: 17.0, // Bosnia Herzegovina VAT
  shippingFee: 9.99,
  freeShippingThreshold: 75.00,
  
  emailNotifications: true,
  orderNotifications: true,
  inventoryNotifications: true,
  customerNotifications: false,
  
  twoFactorAuth: false,
  loginNotifications: true,
  sessionTimeout: 24,
  
  theme: 'system',
  primaryColor: '#ec4899', // Pink-500
  accentColor: '#a855f7', // Purple-500
  
  stripeEnabled: true,
  paypalEnabled: true,
  creditCardEnabled: true,
  
  localDelivery: true,
  internationalShipping: true,
  expressShipping: false,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('store');
  const { toast } = useToast();

  const handleInputChange = (field: keyof StoreSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Settings Saved",
        description: "Your store settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'store', label: 'Store Info', icon: Store },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'store':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Basic information about your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={settings.storeDescription}
                    onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeEmail">Store Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="storePhone">Store Phone</Label>
                    <Input
                      id="storePhone"
                      value={settings.storePhone}
                      onChange={(e) => handleInputChange('storePhone', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>Configure your business preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="BAM">BAM (KM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/Sarajevo">Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.taxRate}
                      onChange={(e) => handleInputChange('taxRate', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="shippingFee">Shipping Fee ($)</Label>
                    <Input
                      id="shippingFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.shippingFee}
                      onChange={(e) => handleInputChange('shippingFee', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => handleInputChange('freeShippingThreshold', Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderNotifications">Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified about new orders</p>
                  </div>
                  <Switch
                    id="orderNotifications"
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => handleInputChange('orderNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inventoryNotifications">Inventory Notifications</Label>
                    <p className="text-sm text-muted-foreground">Alert when inventory is low</p>
                  </div>
                  <Switch
                    id="inventoryNotifications"
                    checked={settings.inventoryNotifications}
                    onCheckedChange={(checked) => handleInputChange('inventoryNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="customerNotifications">Customer Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notifications about customer activity</p>
                  </div>
                  <Switch
                    id="customerNotifications"
                    checked={settings.customerNotifications}
                    onCheckedChange={(checked) => handleInputChange('customerNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and authentication options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loginNotifications">Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified of login attempts</p>
                  </div>
                  <Switch
                    id="loginNotifications"
                    checked={settings.loginNotifications}
                    onCheckedChange={(checked) => handleInputChange('loginNotifications', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="1"
                    max="168"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', Number(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground mt-1">How long before requiring re-authentication</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your admin panel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value: any) => handleInputChange('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        placeholder="#ec4899"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => handleInputChange('accentColor', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.accentColor}
                        onChange={(e) => handleInputChange('accentColor', e.target.value)}
                        placeholder="#a855f7"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Configure accepted payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="stripeEnabled">Stripe</Label>
                    <p className="text-sm text-muted-foreground">Accept credit cards via Stripe</p>
                  </div>
                  <Switch
                    id="stripeEnabled"
                    checked={settings.stripeEnabled}
                    onCheckedChange={(checked) => handleInputChange('stripeEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paypalEnabled">PayPal</Label>
                    <p className="text-sm text-muted-foreground">Accept payments via PayPal</p>
                  </div>
                  <Switch
                    id="paypalEnabled"
                    checked={settings.paypalEnabled}
                    onCheckedChange={(checked) => handleInputChange('paypalEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="creditCardEnabled">Credit Cards</Label>
                    <p className="text-sm text-muted-foreground">Direct credit card processing</p>
                  </div>
                  <Switch
                    id="creditCardEnabled"
                    checked={settings.creditCardEnabled}
                    onCheckedChange={(checked) => handleInputChange('creditCardEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Options</CardTitle>
                <CardDescription>Configure shipping methods and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="localDelivery">Local Delivery</Label>
                    <p className="text-sm text-muted-foreground">Offer local delivery options</p>
                  </div>
                  <Switch
                    id="localDelivery"
                    checked={settings.localDelivery}
                    onCheckedChange={(checked) => handleInputChange('localDelivery', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="internationalShipping">International Shipping</Label>
                    <p className="text-sm text-muted-foreground">Ship to international addresses</p>
                  </div>
                  <Switch
                    id="internationalShipping"
                    checked={settings.internationalShipping}
                    onCheckedChange={(checked) => handleInputChange('internationalShipping', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="expressShipping">Express Shipping</Label>
                    <p className="text-sm text-muted-foreground">Offer expedited shipping options</p>
                  </div>
                  <Switch
                    id="expressShipping"
                    checked={settings.expressShipping}
                    onCheckedChange={(checked) => handleInputChange('expressShipping', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold elegant-text mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Configure your store settings and preferences
            </p>
          </div>
          <Button onClick={handleSave} disabled={isLoading} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Save size={16} className="mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 
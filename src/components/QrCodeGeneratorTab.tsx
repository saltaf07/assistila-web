
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrCode as QrCodeIcon, ExternalLink, AlertCircle, Download, Loader2 } from 'lucide-react';

export default function QrCodeGeneratorTab() {
  const [data, setData] = useState<string>('');
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "https://api.qrserver.com/v1/create-qr-code/";
  const QR_CODE_SIZE = "250x250"; // Default size for the QR code

  const handleGenerateQr = () => {
    if (!data.trim()) {
      setError("Please enter some data to generate a QR code.");
      setQrImageUrl(null);
      return;
    }
    setError(null);
    setIsLoading(true);
    setQrImageUrl(null); // Clear previous QR code

    // Construct the URL for qrserver.com API
    const imageUrl = `${API_BASE_URL}?data=${encodeURIComponent(data.trim())}&size=${QR_CODE_SIZE}&format=png`;
    
    const img = new Image();
    img.onload = () => {
      setQrImageUrl(imageUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError("Failed to load QR code. The API might be down, the data may be too long, or an invalid character was used.");
      setQrImageUrl(null);
      setIsLoading(false);
    };
    img.src = imageUrl;
  };

  const handleDownload = () => {
    if (!qrImageUrl) return;
    try {
      const link = document.createElement('a');
      link.href = qrImageUrl;
      const safeDataString = data.substring(0, 30).replace(/[^a-zA-Z0-9_]/g, '_');
      link.download = `qrcode-${safeDataString || 'generated'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download QR code:", err);
      setError("Could not download the QR code image. You might be able to right-click the image and choose 'Save Image As...'.");
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-xl rounded-xl overflow-hidden border border-border/60">
        <CardHeader className="bg-primary/5 dark:bg-primary/10 border-b border-border/60">
          <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-primary">
            <QrCodeIcon className="h-7 w-7" />
            QR Code Generator
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Enter text or a URL to generate a QR code.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="e.g., https://example.com or your text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="flex-grow text-base py-3 px-4 h-12 rounded-lg border-input focus:ring-primary"
              aria-label="Data for QR code"
              onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleGenerateQr();}}
            />
          </div>
          <Button 
            onClick={handleGenerateQr} 
            disabled={isLoading || !data.trim()} 
            className="w-full sm:w-auto text-base px-8 py-3 h-12 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate QR Code'
            )}
          </Button>

          {error && (
            <Alert variant="destructive" className="shadow-sm rounded-lg border-destructive/70 mt-4">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {qrImageUrl && !error && (
            <div className="mt-6 p-6 border border-border/50 rounded-lg bg-background shadow-sm flex flex-col items-center space-y-4">
              <h3 className="text-lg font-medium text-foreground">Generated QR Code:</h3>
              {/* Using img tag directly as the API returns an image content-type */}
              <img 
                src={qrImageUrl} 
                alt="Generated QR Code" 
                className="w-[250px] h-[250px] object-contain border border-muted rounded-md shadow-md bg-white"
                data-ai-hint="qr code" 
              />
              <Button 
                onClick={handleDownload} 
                variant="outline"
                className="text-base px-6 py-2.5 h-11 rounded-lg border-primary text-primary hover:bg-primary/10"
              >
                <Download className="mr-2 h-5 w-5" />
                Download QR Code (PNG)
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                QR code generated using an external API. Ensure data is not excessively long for best results.
                 (<a href="https://goqr.me/api/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">QRServer API <ExternalLink className="inline-block h-3 w-3 ml-0.5" /></a>)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

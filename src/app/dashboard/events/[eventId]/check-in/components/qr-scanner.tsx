'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface QrScannerProps {
    onScan: (decodedText: string) => void;
    onClose: () => void;
}

export function QrScanner({ onScan, onClose }: QrScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            /* verbose= */ false
        );

        scannerRef.current = scanner;

        scanner.render(
            (decodedText) => {
                // Success callback
                onScan(decodedText);
                // Stop scanning after success to prevent multiple triggers
                scanner.clear().catch(console.error);
            },
            (errorMessage) => {
                // Error callback - usually just means no QR code found in frame yet
                // We don't want to show this to the user constantly
                // console.log(errorMessage);
            }
        );

        // Cleanup
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-card p-6 rounded-lg shadow-lg border">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 z-10"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Scan Attendee QR Code</h3>
                    <div id="reader" className="overflow-hidden rounded-md"></div>
                    <p className="text-sm text-center text-muted-foreground">
                        Point camera at the QR code to check in.
                    </p>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContactSellerButtonProps {
  // Aucun prop n'est nécessaire car nous utilisons des valeurs fixes
}

export function ContactSellerButton({}: ContactSellerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          Contacter le vendeur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nous contacter</DialogTitle>
          <DialogDescription>
            Contactez-nous pour plus d&apos;informations sur ce véhicule.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Email</h3>
            <p className="text-sm">contact.autogate@gmail.com</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Téléphone</h3>
            <p className="text-sm">0486251926</p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

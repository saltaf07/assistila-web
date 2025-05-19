
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DictionaryTab from "@/components/DictionaryTab";
import PrayerTimesTab from "@/components/PrayerTimesTab";
import GamesTab from "@/components/GamesTab";
import QrCodeGeneratorTab from "@/components/QrCodeGeneratorTab";
// Removed import for CodeConverterTab
import { BookOpen, Clock, Gamepad2Icon, QrCode } from "lucide-react"; // Removed Replace icon

export default function TabsNavigation() {
  return (
    <Tabs defaultValue="dictionary" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mx-auto mb-8 md:w-full lg:w-full shadow-sm rounded-xl p-1.5 bg-muted">
        <TabsTrigger value="dictionary" className="flex items-center gap-2 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-lg transition-all">
          <BookOpen className="h-5 w-5" />
          Dictionary
        </TabsTrigger>
        <TabsTrigger value="prayerTimes" className="flex items-center gap-2 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-lg transition-all">
          <Clock className="h-5 w-5" />
          Prayer Times
        </TabsTrigger>
        <TabsTrigger value="games" className="flex items-center gap-2 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-lg transition-all">
          <Gamepad2Icon className="h-5 w-5" />
          Games
        </TabsTrigger>
        <TabsTrigger value="qrCode" className="flex items-center gap-2 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-lg transition-all">
          <QrCode className="h-5 w-5" />
          QR Code
        </TabsTrigger>
        {/* Removed CodeConverter TabTrigger */}
      </TabsList>
      <TabsContent value="dictionary">
        <DictionaryTab />
      </TabsContent>
      <TabsContent value="prayerTimes">
        <PrayerTimesTab />
      </TabsContent>
      <TabsContent value="games">
        <GamesTab />
      </TabsContent>
      <TabsContent value="qrCode">
        <QrCodeGeneratorTab />
      </TabsContent>
      {/* Removed CodeConverter TabsContent */}
    </Tabs>
  );
}

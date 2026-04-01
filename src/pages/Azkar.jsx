import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Sparkles, Check, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const morningAzkar = [
  { id: 1, text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1 },
  { id: 2, text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", count: 1 },
  { id: 3, text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ", count: 1 },
  { id: 4, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
  { id: 5, text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10 },
  { id: 6, text: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ", count: 3 },
  { id: 7, text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ", count: 1 },
  { id: 8, text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3 },
  { id: 9, text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3 },
  { id: 10, text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", count: 1 },
  { id: 11, text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ", count: 1 }
];

const eveningAzkar = [
  { id: 12, text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", count: 1 },
  { id: 13, text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", count: 1 },
  { id: 14, text: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", count: 1 },
  { id: 15, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
  { id: 16, text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10 },
  { id: 17, text: "أَعُوذُ بِاللَّهِ السَّمِيعِ الْعَلِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ", count: 3 },
  { id: 18, text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", count: 1 },
  { id: 19, text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3 },
  { id: 20, text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3 },
  { id: 21, text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ", count: 1 },
  { id: 22, text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ", count: 1 }
];

export default function Azkar() {
  const [currentMorningIndex, setCurrentMorningIndex] = useState(0);
  const [currentEveningIndex, setCurrentEveningIndex] = useState(0);
  const [morningCounts, setMorningCounts] = useState({});
  const [eveningCounts, setEveningCounts] = useState({});

  const handleMorningClick = () => {
    const currentZikr = morningAzkar[currentMorningIndex];
    const currentCount = morningCounts[currentZikr.id] || 0;
    
    if (currentCount + 1 >= currentZikr.count) {
      setMorningCounts({ ...morningCounts, [currentZikr.id]: 0 });
      if (currentMorningIndex < morningAzkar.length - 1) {
        setCurrentMorningIndex(currentMorningIndex + 1);
      }
    } else {
      setMorningCounts({ ...morningCounts, [currentZikr.id]: currentCount + 1 });
    }
  };

  const handleEveningClick = () => {
    const currentZikr = eveningAzkar[currentEveningIndex];
    const currentCount = eveningCounts[currentZikr.id] || 0;
    
    if (currentCount + 1 >= currentZikr.count) {
      setEveningCounts({ ...eveningCounts, [currentZikr.id]: 0 });
      if (currentEveningIndex < eveningAzkar.length - 1) {
        setCurrentEveningIndex(currentEveningIndex + 1);
      }
    } else {
      setEveningCounts({ ...eveningCounts, [currentZikr.id]: currentCount + 1 });
    }
  };

  const resetMorning = () => {
    setCurrentMorningIndex(0);
    setMorningCounts({});
  };

  const resetEvening = () => {
    setCurrentEveningIndex(0);
    setEveningCounts({});
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      <Tabs defaultValue="morning" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
          <TabsTrigger value="morning" className="flex items-center gap-2">
            <Sun className="w-5 h-5" />
            أذكار الصباح
          </TabsTrigger>
          <TabsTrigger value="evening" className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            أذكار المساء
          </TabsTrigger>
        </TabsList>

        <TabsContent value="morning" className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-[600px] rounded-3xl p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">أذكار الصباح</h1>
              <p className="text-gray-600">الذكر {currentMorningIndex + 1} من {morningAzkar.length}</p>
            </div>

            {currentMorningIndex < morningAzkar.length ? (
              <Card 
                onClick={handleMorningClick}
                className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-8 md:p-12">
                  <div className="text-center space-y-6">
                    <p className="text-2xl md:text-3xl leading-relaxed text-gray-800 font-semibold">
                      {morningAzkar[currentMorningIndex].text}
                    </p>
                    
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-6xl font-bold text-amber-600">
                        {(morningCounts[morningAzkar[currentMorningIndex].id] || 0) + 1}
                      </div>
                      <div className="text-4xl text-gray-400">/</div>
                      <div className="text-4xl text-gray-600">
                        {morningAzkar[currentMorningIndex].count}
                      </div>
                    </div>

                    <p className="text-gray-500 text-lg">اضغط للتكرار</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Check className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    بارك الله فيك!
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    أتممت أذكار الصباح
                  </p>
                  <Button
                    onClick={resetMorning}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg"
                  >
                    <RotateCcw className="w-5 h-5 ml-2" />
                    ابدأ من جديد
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="evening" className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-[600px] rounded-3xl p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">أذكار المساء</h1>
              <p className="text-gray-600">الذكر {currentEveningIndex + 1} من {eveningAzkar.length}</p>
            </div>

            {currentEveningIndex < eveningAzkar.length ? (
              <Card 
                onClick={handleEveningClick}
                className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-8 md:p-12">
                  <div className="text-center space-y-6">
                    <p className="text-2xl md:text-3xl leading-relaxed text-gray-800 font-semibold">
                      {eveningAzkar[currentEveningIndex].text}
                    </p>
                    
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-6xl font-bold text-indigo-600">
                        {(eveningCounts[eveningAzkar[currentEveningIndex].id] || 0) + 1}
                      </div>
                      <div className="text-4xl text-gray-400">/</div>
                      <div className="text-4xl text-gray-600">
                        {eveningAzkar[currentEveningIndex].count}
                      </div>
                    </div>

                    <p className="text-gray-500 text-lg">اضغط للتكرار</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Check className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    بارك الله فيك!
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    أتممت أذكار المساء
                  </p>
                  <Button
                    onClick={resetEvening}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-6 text-lg"
                  >
                    <RotateCcw className="w-5 h-5 ml-2" />
                    ابدأ من جديد
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
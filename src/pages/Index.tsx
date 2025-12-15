import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type VehicleType = 'car' | 'plane' | 'helicopter' | 'ship';
type LocationType = 'city' | 'mountains' | 'ocean' | 'desert';

interface Vehicle {
  id: VehicleType;
  name: string;
  icon: string;
  description: string;
  stats: {
    speed: number;
    handling: number;
    difficulty: number;
  };
}

interface Location {
  id: LocationType;
  name: string;
  icon: string;
  description: string;
  difficulty: number;
  weather: string;
  gradient: string;
}

interface RankLevel {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
}

interface OnlinePlayer {
  id: number;
  name: string;
  vehicle: string;
  distance: number;
  rank: string;
}

const vehicles: Vehicle[] = [
  {
    id: 'car',
    name: 'Суперкар',
    icon: 'Car',
    description: 'Мощный спортивный автомобиль с невероятной скоростью',
    stats: { speed: 95, handling: 85, difficulty: 40 }
  },
  {
    id: 'plane',
    name: 'Самолёт',
    icon: 'Plane',
    description: 'Реактивный истребитель с высокой манёвренностью',
    stats: { speed: 100, handling: 70, difficulty: 80 }
  },
  {
    id: 'helicopter',
    name: 'Вертолёт',
    icon: 'Plane',
    description: 'Боевой вертолёт для сложных манёвров',
    stats: { speed: 75, handling: 90, difficulty: 70 }
  },
  {
    id: 'ship',
    name: 'Катер',
    icon: 'Waves',
    description: 'Скоростной катер для покорения водной стихии',
    stats: { speed: 80, handling: 75, difficulty: 50 }
  }
];

const locations: Location[] = [
  {
    id: 'city',
    name: 'Мегаполис',
    icon: 'Building2',
    description: 'Городские улицы с плотным трафиком',
    difficulty: 3,
    weather: 'Ясно',
    gradient: 'from-slate-900 via-blue-900 to-slate-800'
  },
  {
    id: 'mountains',
    name: 'Горный перевал',
    icon: 'Mountain',
    description: 'Опасные серпантины на высоте 3000м',
    difficulty: 5,
    weather: 'Снег',
    gradient: 'from-slate-800 via-cyan-900 to-blue-950'
  },
  {
    id: 'ocean',
    name: 'Открытый океан',
    icon: 'Waves',
    description: 'Бескрайние воды с высокими волнами',
    difficulty: 4,
    weather: 'Шторм',
    gradient: 'from-blue-950 via-blue-800 to-cyan-900'
  },
  {
    id: 'desert',
    name: 'Пустыня',
    icon: 'Sun',
    description: 'Раскалённые пески и миражи',
    difficulty: 4,
    weather: '+45°C',
    gradient: 'from-orange-950 via-amber-900 to-yellow-900'
  }
];

const ranks: RankLevel[] = [
  { level: 1, name: 'Новичок', minXP: 0, maxXP: 999, color: 'text-gray-400', icon: 'User' },
  { level: 2, name: 'Любитель', minXP: 1000, maxXP: 2999, color: 'text-green-400', icon: 'UserCheck' },
  { level: 3, name: 'Профи', minXP: 3000, maxXP: 5999, color: 'text-blue-400', icon: 'Award' },
  { level: 4, name: 'Эксперт', minXP: 6000, maxXP: 9999, color: 'text-purple-400', icon: 'Star' },
  { level: 5, name: 'Легенда', minXP: 10000, maxXP: 99999, color: 'text-amber-400', icon: 'Crown' }
];

const onlinePlayers: OnlinePlayer[] = [
  { id: 1, name: 'SpeedRacer_Pro', vehicle: 'Суперкар', distance: 2.4, rank: 'Легенда' },
  { id: 2, name: 'SkyMaster_99', vehicle: 'Самолёт', distance: 5.1, rank: 'Эксперт' },
  { id: 3, name: 'NavyCaptain', vehicle: 'Катер', distance: 3.7, rank: 'Профи' },
  { id: 4, name: 'HeliPilot_X', vehicle: 'Вертолёт', distance: 4.2, rank: 'Эксперт' }
];

const Index = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('city');
  const [isSimulating, setIsSimulating] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [playerXP, setPlayerXP] = useState(4200);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const engineOscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const currentRank = ranks.find(r => playerXP >= r.minXP && playerXP <= r.maxXP) || ranks[0];
  const rankProgress = ((playerXP - currentRank.minXP) / (currentRank.maxXP - currentRank.minXP)) * 100;

  useEffect(() => {
    if (soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (soundEnabled && isSimulating && audioContextRef.current && gainNodeRef.current) {
      if (!engineOscillatorRef.current) {
        engineOscillatorRef.current = audioContextRef.current.createOscillator();
        engineOscillatorRef.current.type = 'sawtooth';
        engineOscillatorRef.current.connect(gainNodeRef.current);
        engineOscillatorRef.current.start();
      }

      const baseFrequency = 80;
      const frequency = baseFrequency + (speed / 280) * 200;
      engineOscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      
      const volume = Math.min(0.1 + (speed / 280) * 0.15, 0.25);
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    } else if (engineOscillatorRef.current && !isSimulating) {
      engineOscillatorRef.current.stop();
      engineOscillatorRef.current = null;
    }
  }, [soundEnabled, isSimulating, speed]);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setPlayerXP(prev => prev + 50);
    
    const interval = setInterval(() => {
      setSpeed(prev => Math.min(prev + Math.random() * 10, 280));
      setAltitude(prev => Math.min(prev + Math.random() * 50, 10000));
      setFuel(prev => Math.max(prev - Math.random() * 0.5, 0));
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
    }, 30000);
  };

  if (isSimulating && selectedVehicle) {
    const vehicle = vehicles.find(v => v.id === selectedVehicle)!;
    const location = locations.find(l => l.id === selectedLocation)!;
    
    return (
      <div className={`min-h-screen bg-gradient-to-b ${location.gradient}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => {
                setIsSimulating(false);
                setSpeed(0);
                setAltitude(0);
                setFuel(100);
              }}
            >
              <Icon name="ArrowLeft" className="mr-2" />
              Вернуться в лобби
            </Button>

            <Button
              variant={soundEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-white"
            >
              <Icon name={soundEnabled ? "Volume2" : "VolumeX"} className="mr-2 h-4 w-4" />
              {soundEnabled ? 'Звук ВКЛ' : 'Звук ВЫКЛ'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-black/40 backdrop-blur-xl border-white/20 overflow-hidden relative h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.3),transparent_50%)]" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent animate-speed-line" />
                  {soundEnabled && (
                    <>
                      <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-speed-line" style={{ animationDelay: '0.3s' }} />
                      <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-speed-line" style={{ animationDelay: '0.6s' }} />
                    </>
                  )}
                </div>
                
                <CardContent className="relative z-20 h-full flex flex-col justify-between p-8">
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-2 bg-white/10 text-white border-white/20">
                      <Icon name={location.icon as any} className="mr-2 h-3 w-3" />
                      {location.name} • {location.weather}
                    </Badge>
                    <h2 className="text-4xl font-bold text-white text-glow mb-2">{vehicle.name}</h2>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="outline" className="text-sm px-3 py-1 bg-black/20 text-white border-white/30">
                        <Icon name="Wifi" className="mr-2 h-3 w-3" />
                        Онлайн
                      </Badge>
                      {soundEnabled && (
                        <Badge variant="outline" className="text-sm px-3 py-1 bg-green-500/20 text-green-300 border-green-400/30 animate-pulse">
                          <Icon name="Radio" className="mr-2 h-3 w-3" />
                          Звук активен
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center animate-float">
                      <Icon name={vehicle.icon as any} className="h-40 w-40 text-white mb-8 drop-shadow-2xl" />
                      <div className="text-6xl font-bold font-mono text-white text-glow drop-shadow-2xl">
                        {speed.toFixed(0)} <span className="text-2xl">км/ч</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-black/40 backdrop-blur border-blue-400/30">
                      <CardContent className="p-4 text-center">
                        <Icon name="Gauge" className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                        <div className="text-2xl font-bold font-mono text-white">{speed.toFixed(0)}</div>
                        <div className="text-xs text-blue-200">Скорость</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/40 backdrop-blur border-purple-400/30">
                      <CardContent className="p-4 text-center">
                        <Icon name="Navigation" className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                        <div className="text-2xl font-bold font-mono text-white">{altitude.toFixed(0)}</div>
                        <div className="text-xs text-purple-200">Высота (м)</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-black/40 backdrop-blur border-amber-400/30">
                      <CardContent className="p-4 text-center">
                        <Icon name="Fuel" className="h-6 w-6 mx-auto mb-2 text-amber-400" />
                        <div className="text-2xl font-bold font-mono text-white">{fuel.toFixed(0)}%</div>
                        <div className="text-xs text-amber-200">Топливо</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon name={currentRank.icon as any} className={`h-6 w-6 ${currentRank.color}`} />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{currentRank.name}</h3>
                      <p className="text-xs text-white/60">Уровень {currentRank.level}</p>
                    </div>
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                      {playerXP} XP
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress value={rankProgress} className="h-3" />
                    <div className="flex justify-between text-xs text-white/60">
                      <span>{currentRank.minXP} XP</span>
                      <span>{currentRank.maxXP} XP</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-white/60 mb-2">Все ранги:</p>
                    <div className="flex gap-2 flex-wrap">
                      {ranks.map((rank) => (
                        <Badge 
                          key={rank.level}
                          variant={rank.level === currentRank.level ? "default" : "outline"}
                          className={`${rank.color} text-xs ${rank.level === currentRank.level ? 'bg-white/20' : 'bg-black/20'} border-white/20`}
                        >
                          <Icon name={rank.icon as any} className="mr-1 h-3 w-3" />
                          {rank.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon name="Users" className="h-5 w-5 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">Игроки онлайн</h3>
                    <Badge variant="secondary" className="ml-auto bg-white/10 text-white border-white/20">
                      {onlinePlayers.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {onlinePlayers.map((player) => {
                      const pRank = ranks.find(r => r.name === player.rank);
                      return (
                        <Card key={player.id} className="bg-white/5 border-white/10">
                          <CardContent className="p-3 flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-purple-600 text-white font-bold">
                                {player.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-white truncate">{player.name}</div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-white/60">{player.vehicle}</span>
                                {pRank && (
                                  <Badge variant="outline" className={`${pRank.color} text-[10px] px-1 py-0 h-4 bg-black/20 border-white/20`}>
                                    {player.rank}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-blue-400">{player.distance} км</div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Rocket" className="h-12 w-12 text-primary animate-pulse-slow" />
            <h1 className="text-6xl font-bold text-glow">СИМУЛЯТОР</h1>
          </div>
          <p className="text-xl text-muted-foreground">Реалистичное управление • Онлайн мультиплеер • Фотореалистичная графика</p>
          
          <div className="flex items-center justify-center gap-6 mt-6">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Icon name="Wifi" className="mr-2 h-4 w-4" />
              {onlinePlayers.length} игроков онлайн
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Icon name={currentRank.icon as any} className={`mr-2 h-4 w-4 ${currentRank.color}`} />
              Ваш ранг: {currentRank.name}
            </Badge>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-card via-card to-primary/5 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Icon name={currentRank.icon as any} className={`h-8 w-8 ${currentRank.color}`} />
                <div>
                  <h3 className="text-2xl font-bold">{currentRank.name}</h3>
                  <p className="text-sm text-muted-foreground">Уровень {currentRank.level} • {playerXP} XP</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {Math.round(rankProgress)}%
              </Badge>
            </div>
            <Progress value={rankProgress} className="h-4 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Текущий уровень</span>
              <span>До следующего: {currentRank.maxXP - playerXP + 1} XP</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="vehicle" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="vehicle" className="text-lg">
              <Icon name="Car" className="mr-2" />
              Транспорт
            </TabsTrigger>
            <TabsTrigger value="location" className="text-lg">
              <Icon name="Map" className="mr-2" />
              Локация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicle">
            <h2 className="text-3xl font-bold mb-6 text-center">Выберите транспорт</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles.map((vehicle) => (
                <Card 
                  key={vehicle.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 ${
                    selectedVehicle === vehicle.id 
                      ? 'border-primary border-2 bg-gradient-to-br from-card to-primary/10' 
                      : 'border-muted bg-card/80 backdrop-blur'
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.id)}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <Icon 
                        name={vehicle.icon as any} 
                        className={`h-16 w-16 mx-auto mb-3 transition-colors ${
                          selectedVehicle === vehicle.id ? 'text-primary' : 'text-muted-foreground'
                        }`} 
                      />
                      <h3 className="text-2xl font-bold mb-2">{vehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">{vehicle.description}</p>
                    </div>

                    <div className="space-y-3 mt-6">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Скорость</span>
                          <span className="font-bold">{vehicle.stats.speed}%</span>
                        </div>
                        <Progress value={vehicle.stats.speed} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Управление</span>
                          <span className="font-bold">{vehicle.stats.handling}%</span>
                        </div>
                        <Progress value={vehicle.stats.handling} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Сложность</span>
                          <span className="font-bold">{vehicle.stats.difficulty}%</span>
                        </div>
                        <Progress value={vehicle.stats.difficulty} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="location">
            <h2 className="text-3xl font-bold mb-6 text-center">Выберите локацию</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {locations.map((location) => (
                <Card 
                  key={location.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-secondary/20 ${
                    selectedLocation === location.id 
                      ? 'border-secondary border-2 bg-gradient-to-br from-card to-secondary/10' 
                      : 'border-muted bg-card/80 backdrop-blur'
                  }`}
                  onClick={() => setSelectedLocation(location.id)}
                >
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className={`mx-auto mb-4 w-full h-32 rounded-lg bg-gradient-to-br ${location.gradient} flex items-center justify-center`}>
                        <Icon 
                          name={location.icon as any} 
                          className="h-16 w-16 text-white drop-shadow-lg" 
                        />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{location.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{location.description}</p>
                      
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Icon name="Cloud" className="mr-1 h-3 w-3" />
                          {location.weather}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Icon name="Zap" className="mr-1 h-3 w-3" />
                          {Array(location.difficulty).fill('⭐').join('')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {selectedVehicle && (
          <div className="text-center animate-fade-in">
            <Button 
              size="lg" 
              className="text-xl px-12 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/50"
              onClick={handleStartSimulation}
            >
              <Icon name="Play" className="mr-3 h-6 w-6" />
              Начать симуляцию
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

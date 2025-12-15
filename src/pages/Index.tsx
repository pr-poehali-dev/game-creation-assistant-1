import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type VehicleType = 'car' | 'plane' | 'helicopter' | 'ship';

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

interface OnlinePlayer {
  id: number;
  name: string;
  vehicle: string;
  distance: number;
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

const onlinePlayers: OnlinePlayer[] = [
  { id: 1, name: 'SpeedRacer_Pro', vehicle: 'Суперкар', distance: 2.4 },
  { id: 2, name: 'SkyMaster_99', vehicle: 'Самолёт', distance: 5.1 },
  { id: 3, name: 'NavyCaptain', vehicle: 'Катер', distance: 3.7 },
  { id: 4, name: 'HeliPilot_X', vehicle: 'Вертолёт', distance: 4.2 }
];

const Index = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [fuel, setFuel] = useState(100);

  const handleStartSimulation = () => {
    setIsSimulating(true);
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
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6"
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-card via-card to-muted border-primary/30 overflow-hidden relative h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(14,165,233,0.3),transparent_50%)]" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-speed-line" />
                </div>
                
                <CardContent className="relative z-20 h-full flex flex-col justify-between p-8">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-glow mb-2">{vehicle.name}</h2>
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      <Icon name="Wifi" className="mr-2 h-4 w-4" />
                      Онлайн режим
                    </Badge>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center animate-float">
                      <Icon name={vehicle.icon as any} className="h-40 w-40 text-primary mb-8" />
                      <div className="text-6xl font-bold font-mono text-glow">
                        {speed.toFixed(0)} <span className="text-2xl">км/ч</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-background/50 backdrop-blur border-primary/20">
                      <CardContent className="p-4 text-center">
                        <Icon name="Gauge" className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="text-2xl font-bold font-mono">{speed.toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Скорость</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-background/50 backdrop-blur border-secondary/20">
                      <CardContent className="p-4 text-center">
                        <Icon name="Navigation" className="h-6 w-6 mx-auto mb-2 text-secondary" />
                        <div className="text-2xl font-bold font-mono">{altitude.toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Высота (м)</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-background/50 backdrop-blur border-accent/20">
                      <CardContent className="p-4 text-center">
                        <Icon name="Fuel" className="h-6 w-6 mx-auto mb-2 text-accent" />
                        <div className="text-2xl font-bold font-mono">{fuel.toFixed(0)}%</div>
                        <div className="text-xs text-muted-foreground">Топливо</div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card/80 backdrop-blur border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon name="Users" className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">Игроки онлайн</h3>
                    <Badge variant="secondary" className="ml-auto">{onlinePlayers.length}</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {onlinePlayers.map((player) => (
                      <Card key={player.id} className="bg-muted/50 border-muted">
                        <CardContent className="p-3 flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {player.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{player.name}</div>
                            <div className="text-xs text-muted-foreground">{player.vehicle}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">{player.distance} км</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-muted border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon name="Trophy" className="h-5 w-5 text-accent" />
                    <h3 className="text-xl font-bold">Статистика</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Пройдено км</span>
                        <span className="text-sm font-bold">324.8</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Время в игре</span>
                        <span className="text-sm font-bold">12ч 34м</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Достижения</span>
                        <span className="text-sm font-bold">18/50</span>
                      </div>
                      <Progress value={36} className="h-2" />
                    </div>
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
              <Icon name="Globe" className="mr-2 h-4 w-4" />
              Глобальный сервер
            </Badge>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">Выберите транспорт</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

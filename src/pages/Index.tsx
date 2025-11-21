import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const API_URL = 'https://functions.poehali.dev/719664df-8de7-43cc-ba04-516b5c8800fe';

interface Service {
  id?: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface Region {
  id?: number;
  name: string;
  passengers: string;
  routes: number;
}

interface News {
  id?: number;
  date: string;
  title: string;
  category: string;
  content?: string;
}

interface Schedule {
  id?: number;
  route: string;
  departure: string;
  arrival: string;
  transport: string;
}

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const [services, setServices] = useState<Service[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEntity, setEditEntity] = useState<string>('');
  const [editItem, setEditItem] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setServices(data.services || []);
      setRegions(data.regions || []);
      setNews(data.news || []);
      setSchedule(data.schedule || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = () => {
    if (loginData.username === 'BLINOV' && loginData.password === '31082010В') {
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setActiveSection('dashboard');
      toast.success('Добро пожаловать, Генеральный Директор!');
    } else {
      toast.error('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('home');
    setLoginData({ username: '', password: '' });
    toast.info('Вы вышли из системы');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const openEditDialog = (entity: string, item: any = null) => {
    setEditEntity(entity);
    setEditItem(item || {});
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const method = editItem.id ? 'PUT' : 'POST';
      const response = await fetch(`${API_URL}?entity=${editEntity}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem)
      });

      if (response.ok) {
        toast.success(editItem.id ? 'Обновлено!' : 'Добавлено!');
        setEditDialogOpen(false);
        fetchAllData();
      }
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  const handleDelete = async (entity: string, id: number) => {
    try {
      const response = await fetch(`${API_URL}?entity=${entity}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        toast.success('Удалено!');
        fetchAllData();
      }
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-float">
                <Icon name="Bus" className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">АО "ОМР ВВОПП"</h1>
                <p className="text-xs text-slate-600">Транспортная компания</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {['home', 'about', 'services', 'schedule', 'regions', 'news', 'contacts'].map((section) => (
                <Button
                  key={section}
                  variant={activeSection === section ? 'default' : 'ghost'}
                  onClick={() => setActiveSection(section)}
                  className="transition-all duration-300"
                >
                  {section === 'home' && 'Главная'}
                  {section === 'about' && 'О компании'}
                  {section === 'services' && 'Услуги'}
                  {section === 'schedule' && 'Расписание'}
                  {section === 'regions' && 'Регионы'}
                  {section === 'news' && 'Новости'}
                  {section === 'contacts' && 'Контакты'}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-2xl font-bold text-blue-600 font-mono">{formatTime(currentTime)}</div>
                <div className="text-xs text-slate-600">{formatDate(currentTime)}</div>
              </div>
              {!isLoggedIn ? (
                <Button onClick={() => setIsLoginOpen(true)} variant="outline" className="gap-2">
                  <Icon name="User" size={18} />
                  Вход
                </Button>
              ) : (
                <Button onClick={handleLogout} variant="outline" className="gap-2">
                  <Icon name="LogOut" size={18} />
                  Выход
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 p-12 text-white shadow-2xl">
              <div className="relative z-10 max-w-3xl">
                <Badge className="mb-4 bg-white/20 text-white border-white/30">Крупнейшая транспортная компания</Badge>
                <h1 className="text-5xl font-bold mb-4 animate-scale-in">АО "ОМР ВВОПП"</h1>
                <p className="text-xl mb-8 text-white/90">
                  Обслуживаем 4 региона: Нижегородскую, Владимирскую и Кировскую области и Республику Удмуртия
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Button size="lg" variant="secondary" className="gap-2" onClick={() => setActiveSection('services')}>
                    <Icon name="ArrowRight" size={20} />
                    Наши услуги
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2" onClick={() => setActiveSection('schedule')}>
                    <Icon name="Clock" size={20} />
                    Расписание
                  </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: 'Users', value: '7+ млн', label: 'Пассажиров в год', color: 'from-blue-500 to-blue-600' },
                { icon: 'MapPin', value: `${regions.reduce((sum, r) => sum + r.routes, 0)}`, label: 'Маршрутов', color: 'from-purple-500 to-purple-600' },
                { icon: 'Bus', value: '450+', label: 'Единиц транспорта', color: 'from-orange-500 to-orange-600' },
                { icon: 'Award', value: regions.length.toString(), label: 'Региона', color: 'from-green-500 to-green-600' }
              ].map((stat, i) => (
                <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon name={stat.icon} className="text-white" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-slate-900">О компании</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8"></div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="prose max-w-none">
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    АО "ОМР ВВОПП" — крупнейшая транспортная компания, обслуживающая четыре ключевых региона России: 
                    Нижегородскую, Владимирскую и Кировскую области, а также Республику Удмуртия.
                  </p>
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    Мы специализируемся на регулярных перевозках пассажиров различными видами транспорта: 
                    автобусами, микроавтобусами, электропоездами и поездами дальнего следования.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                      <Icon name="Target" className="text-blue-600 mb-3" size={32} />
                      <h3 className="text-xl font-bold mb-2 text-slate-900">Наша миссия</h3>
                      <p className="text-slate-700">Обеспечить безопасные, комфортные и доступные транспортные услуги для всех жителей регионов</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                      <Icon name="Eye" className="text-purple-600 mb-3" size={32} />
                      <h3 className="text-xl font-bold mb-2 text-slate-900">Наше видение</h3>
                      <p className="text-slate-700">Стать лидером в области пассажирских перевозок, устанавливая новые стандарты качества обслуживания</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'services' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Наши услуги</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, i) => (
                <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon name={service.icon} className="text-white" size={32} />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="gap-2 text-blue-600">
                      Подробнее <Icon name="ArrowRight" size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'schedule' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Расписание</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8"></div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left p-4 font-semibold text-slate-700">Маршрут</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Отправление</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Прибытие</th>
                        <th className="text-left p-4 font-semibold text-slate-700">Транспорт</th>
                        <th className="text-left p-4 font-semibold text-slate-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((item, i) => (
                        <tr key={i} className="border-t hover:bg-blue-50/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Icon name="MapPin" size={16} className="text-blue-600" />
                              <span className="font-medium">{item.route}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="font-mono">{item.departure}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="font-mono">{item.arrival}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{item.transport}</Badge>
                          </td>
                          <td className="p-4">
                            <Button size="sm" variant="ghost">Купить билет</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'regions' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Регионы обслуживания</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {regions.map((region, i) => (
                <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{region.name}</CardTitle>
                        <CardDescription>Пассажиропоток: {region.passengers}</CardDescription>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Icon name="MapPin" className="text-white" size={24} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Icon name="Route" size={16} className="text-blue-600" />
                        <span className="text-sm text-slate-600">{region.routes} маршрутов</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'news' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Новости</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8"></div>
            </div>

            <div className="space-y-4">
              {news.map((item, i) => (
                <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="text-sm text-slate-500">{item.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                      </div>
                      <Icon name="ChevronRight" className="text-slate-400 mt-1" size={20} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'contacts' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-slate-900">Контакты</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Контактная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Icon name="Phone" className="text-blue-600 mt-1" size={20} />
                    <div>
                      <div className="font-semibold">Телефон</div>
                      <div className="text-slate-600">+7 (831) 123-45-67</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Mail" className="text-blue-600 mt-1" size={20} />
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-slate-600">info@omr-vvopp.ru</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="MapPin" className="text-blue-600 mt-1" size={20} />
                    <div>
                      <div className="font-semibold">Адрес</div>
                      <div className="text-slate-600">г. Нижний Новгород, ул. Транспортная, д. 1</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Clock" className="text-blue-600 mt-1" size={20} />
                    <div>
                      <div className="font-semibold">Часы работы</div>
                      <div className="text-slate-600">Пн-Пт: 8:00 - 20:00<br/>Сб-Вс: 9:00 - 18:00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Напишите нам</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Имя</Label>
                    <Input placeholder="Ваше имя" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                  <div>
                    <Label>Сообщение</Label>
                    <Input placeholder="Ваше сообщение" />
                  </div>
                  <Button className="w-full gap-2">
                    <Icon name="Send" size={16} />
                    Отправить
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'dashboard' && isLoggedIn && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold mb-2 text-slate-900">Панель управления</h2>
                <p className="text-slate-600">Генеральный директор</p>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Активная сессия</Badge>
            </div>

            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="services">Услуги</TabsTrigger>
                <TabsTrigger value="regions">Регионы</TabsTrigger>
                <TabsTrigger value="news">Новости</TabsTrigger>
                <TabsTrigger value="schedule">Расписание</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Управление услугами</h3>
                  <Button onClick={() => openEditDialog('services')} className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить услугу
                  </Button>
                </div>
                <div className="grid gap-4">
                  {services.map((service) => (
                    <Card key={service.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center`}>
                            <Icon name={service.icon} className="text-white" size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold">{service.title}</h4>
                            <p className="text-sm text-slate-600">{service.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog('services', service)}>
                            <Icon name="Pencil" size={16} />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => service.id && handleDelete('services', service.id)}>
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="regions" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Управление регионами</h3>
                  <Button onClick={() => openEditDialog('regions')} className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить регион
                  </Button>
                </div>
                <div className="grid gap-4">
                  {regions.map((region) => (
                    <Card key={region.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{region.name}</h4>
                          <p className="text-sm text-slate-600">Пассажиропоток: {region.passengers} | Маршрутов: {region.routes}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog('regions', region)}>
                            <Icon name="Pencil" size={16} />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => region.id && handleDelete('regions', region.id)}>
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="news" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Управление новостями</h3>
                  <Button onClick={() => openEditDialog('news')} className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить новость
                  </Button>
                </div>
                <div className="grid gap-4">
                  {news.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{item.category}</Badge>
                            <span className="text-sm text-slate-500">{item.date}</span>
                          </div>
                          <h4 className="font-semibold">{item.title}</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog('news', item)}>
                            <Icon name="Pencil" size={16} />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => item.id && handleDelete('news', item.id)}>
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Управление расписанием</h3>
                  <Button onClick={() => openEditDialog('schedule')} className="gap-2">
                    <Icon name="Plus" size={16} />
                    Добавить маршрут
                  </Button>
                </div>
                <div className="grid gap-4">
                  {schedule.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{item.route}</h4>
                          <p className="text-sm text-slate-600">
                            {item.departure} → {item.arrival} | {item.transport}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog('schedule', item)}>
                            <Icon name="Pencil" size={16} />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => item.id && handleDelete('schedule', item.id)}>
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">АО "ОМР ВВОПП"</h3>
              <p className="text-slate-400 text-sm">Крупнейшая транспортная компания региона</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                {services.slice(0, 4).map((s, i) => <li key={i}>{s.title}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>О нас</li>
                <li>Вакансии</li>
                <li>Новости</li>
                <li>Контакты</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>+7 (831) 123-45-67</li>
                <li>info@omr-vvopp.ru</li>
                <li>г. Нижний Новгород</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2025 АО "ОМР ВВОПП". Все права защищены.
          </div>
        </div>
      </footer>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Вход в личный кабинет</DialogTitle>
            <DialogDescription>Введите ваши учётные данные для доступа к панели управления</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="Введите логин"
              />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Введите пароль"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editItem?.id ? 'Редактировать' : 'Добавить'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {editEntity === 'services' && (
              <>
                <div>
                  <Label>Название</Label>
                  <Input value={editItem.title || ''} onChange={(e) => setEditItem({...editItem, title: e.target.value})} />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea value={editItem.description || ''} onChange={(e) => setEditItem({...editItem, description: e.target.value})} />
                </div>
                <div>
                  <Label>Иконка</Label>
                  <Input value={editItem.icon || ''} onChange={(e) => setEditItem({...editItem, icon: e.target.value})} placeholder="Bus, Train, Car" />
                </div>
                <div>
                  <Label>Цвет</Label>
                  <Select value={editItem.color || ''} onValueChange={(v) => setEditItem({...editItem, color: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-blue-500">Синий</SelectItem>
                      <SelectItem value="bg-orange-500">Оранжевый</SelectItem>
                      <SelectItem value="bg-purple-500">Фиолетовый</SelectItem>
                      <SelectItem value="bg-green-500">Зелёный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {editEntity === 'regions' && (
              <>
                <div>
                  <Label>Название региона</Label>
                  <Input value={editItem.name || ''} onChange={(e) => setEditItem({...editItem, name: e.target.value})} />
                </div>
                <div>
                  <Label>Пассажиропоток</Label>
                  <Input value={editItem.passengers || ''} onChange={(e) => setEditItem({...editItem, passengers: e.target.value})} placeholder="2.5 млн/год" />
                </div>
                <div>
                  <Label>Количество маршрутов</Label>
                  <Input type="number" value={editItem.routes || ''} onChange={(e) => setEditItem({...editItem, routes: parseInt(e.target.value)})} />
                </div>
              </>
            )}
            
            {editEntity === 'news' && (
              <>
                <div>
                  <Label>Дата</Label>
                  <Input value={editItem.date || ''} onChange={(e) => setEditItem({...editItem, date: e.target.value})} placeholder="15 ноября 2025" />
                </div>
                <div>
                  <Label>Заголовок</Label>
                  <Input value={editItem.title || ''} onChange={(e) => setEditItem({...editItem, title: e.target.value})} />
                </div>
                <div>
                  <Label>Категория</Label>
                  <Input value={editItem.category || ''} onChange={(e) => setEditItem({...editItem, category: e.target.value})} placeholder="Маршруты, Техника, Акции" />
                </div>
                <div>
                  <Label>Содержание</Label>
                  <Textarea value={editItem.content || ''} onChange={(e) => setEditItem({...editItem, content: e.target.value})} rows={5} />
                </div>
              </>
            )}
            
            {editEntity === 'schedule' && (
              <>
                <div>
                  <Label>Маршрут</Label>
                  <Input value={editItem.route || ''} onChange={(e) => setEditItem({...editItem, route: e.target.value})} placeholder="Нижний Новгород - Владимир" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Отправление</Label>
                    <Input value={editItem.departure || ''} onChange={(e) => setEditItem({...editItem, departure: e.target.value})} placeholder="08:00" />
                  </div>
                  <div>
                    <Label>Прибытие</Label>
                    <Input value={editItem.arrival || ''} onChange={(e) => setEditItem({...editItem, arrival: e.target.value})} placeholder="11:30" />
                  </div>
                </div>
                <div>
                  <Label>Транспорт</Label>
                  <Input value={editItem.transport || ''} onChange={(e) => setEditItem({...editItem, transport: e.target.value})} placeholder="Автобус" />
                </div>
              </>
            )}
            
            <Button onClick={handleSave} className="w-full">
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

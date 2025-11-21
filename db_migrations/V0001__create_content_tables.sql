-- Create tables for transport company content management

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    icon VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    color VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Regions table
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    passengers VARCHAR(100) NOT NULL,
    routes INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    date VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedule table
CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    route VARCHAR(200) NOT NULL,
    departure VARCHAR(10) NOT NULL,
    arrival VARCHAR(10) NOT NULL,
    transport VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company info table
CREATE TABLE IF NOT EXISTS company_info (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data for services
INSERT INTO services (icon, title, description, color) VALUES
('Bus', 'Автобусы', 'Регулярные междугородние маршруты', 'bg-blue-500'),
('Car', 'Микроавтобусы', 'Комфортные пригородные перевозки', 'bg-orange-500'),
('Train', 'Электропоезда', 'Быстрые электрички по области', 'bg-purple-500'),
('Train', 'Поезда дальнего следования', 'Межрегиональные маршруты', 'bg-green-500');

-- Insert initial data for regions
INSERT INTO regions (name, passengers, routes) VALUES
('Нижегородская область', '2.5 млн/год', 120),
('Владимирская область', '1.8 млн/год', 85),
('Кировская область', '1.2 млн/год', 67),
('Республика Удмуртия', '1.6 млн/год', 92);

-- Insert initial data for news
INSERT INTO news (date, title, category, content) VALUES
('15 ноября 2025', 'Запуск нового маршрута Нижний Новгород - Владимир', 'Маршруты', 'С 15 ноября запущен новый регулярный маршрут'),
('10 ноября 2025', 'Обновление парка автобусов: 50 новых машин', 'Техника', 'Компания приобрела 50 новых современных автобусов'),
('5 ноября 2025', 'Скидки для студентов на междугородние перевозки', 'Акции', 'Студентам предоставляется скидка 20%');

-- Insert initial data for schedule
INSERT INTO schedule (route, departure, arrival, transport) VALUES
('Нижний Новгород - Владимир', '08:00', '11:30', 'Автобус'),
('Киров - Ижевск', '09:15', '12:45', 'Микроавтобус'),
('Нижний Новгород - Киров', '10:30', '16:00', 'Электропоезд'),
('Владимир - Москва', '07:00', '12:30', 'Поезд');

-- Insert company info
INSERT INTO company_info (key, value) VALUES
('phone', '+7 (831) 123-45-67'),
('email', 'info@omr-vvopp.ru'),
('address', 'г. Нижний Новгород, ул. Транспортная, д. 1'),
('working_hours', 'Пн-Пт: 8:00 - 20:00, Сб-Вс: 9:00 - 18:00');

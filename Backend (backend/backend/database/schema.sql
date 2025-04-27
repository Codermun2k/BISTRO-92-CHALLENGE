CREATE TABLE Users (
    user_id UUID PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('customer', 'staff', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Tables (
    table_id UUID PRIMARY KEY,
    table_number INTEGER UNIQUE,
    status VARCHAR(20) CHECK (status IN ('occupied', 'free')),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Menu_Items (
    item_id UUID PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    category VARCHAR(50),
    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE Orders (
    order_id UUID PRIMARY KEY,
    table_id UUID REFERENCES Tables(table_id),
    user_id UUID REFERENCES Users(user_id),
    status VARCHAR(20) CHECK (status IN ('pending', 'cooking', 'served', 'completed')),
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2),
    version INTEGER DEFAULT 1
);

CREATE TABLE Order_Items (
    order_item_id UUID PRIMARY KEY,
    order_id UUID REFERENCES Orders(order_id),
    item_id UUID REFERENCES Menu_Items(item_id),
    quantity INTEGER,
    customizations JSONB
);

CREATE TABLE Payments (
    payment_id UUID PRIMARY KEY,
    order_id UUID REFERENCES Orders(order_id),
    amount DECIMAL(10, 2),
    method VARCHAR(20) CHECK (method IN ('card', 'cash', 'mobile')),
    status VARCHAR(20) CHECK (status IN ('pending', 'completed')),
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_table_id ON Orders(table_id);
CREATE INDEX idx_orders_order_time ON Orders(order_time);
CREATE INDEX idx_order_items_item_id ON Order_Items(item_id);

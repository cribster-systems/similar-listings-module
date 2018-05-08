CREATE TABLE listings (
    id INT PRIMARY KEY,
    imageUrl VARCHAR(200),
    description VARCHAR(200),
    title VARCHAR(200),
    price INT,
    num_reviews INT,
    avg_rating REAL
);

CREATE TABLE keywords (
    id INT PRIMARY KEY,
    keyword VARCHAR(40)
);

CREATE TABLE listings_keywords (
    id INT PRIMARY KEY,
    listingId INT REFERENCES listings(id),
    keywordId INT REFERENCES keywords(id)
);
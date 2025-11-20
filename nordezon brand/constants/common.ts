const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];

const dashboard = {
  "product": {
    "lineData": {
      "labels": [
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov"
      ],
      "datasets": [
        {
          "data": [
            0,
            0,
            0,
            0,
            0,
            0
          ],
          "strokeWidth": 2,
          "label": "Likes"
        },
        {
          "data": [
            0,
            0,
            0,
            0,
            0,
            0
          ],
          "strokeWidth": 2,
          "label": "Comments"
        },
        {
          "data": [
            0,
            0,
            0,
            0,
            0,
            0
          ],
          "strokeWidth": 2,
          "label": "Carts"
        }
      ]
    }
  },
  "order": {
    "totalCounts": {
      "postCount": 0,
      "pendingOrders": 0,
      "processingOrders": 0,
      "completedOrders": 0,
      "cancelledOrders": 0
    },
    "lineData": {
      "labels": [
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov"
      ],
      "datasets": [
        {
          "data": [
            0,
            0,
            0,
            0,
            0,
            0
          ],
          "strokeWidth": 2
        }
      ]
    }
  }
}

const tabs = [
  { label: 'Dashboard', icon: 'speedometer-outline', route: 'brandHome' },
  { label: 'Profile', icon: 'person-outline', route: 'profile' },
  { label: 'Orders', icon: 'receipt-outline', route: 'orders' },
  { label: 'Post', icon: 'create-outline', route: 'posts' },
  { label: 'Reels', icon: 'play-circle-outline', route: 'reels' },
  { label: 'Stories', icon: 'play-circle-outline', route: 'stories' },
  { label: 'Help & Support', icon: 'help-circle-outline', route: 'catalog' },
  { label: 'About', icon: 'information-circle-outline', route: 'catalog' },
  { label: 'Logout', icon: 'log-out-outline', route: 'logout' },
];


const statuses = [
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" }
]


const dummyProducts = [
  {
    id: '1',
    name: 'Embroidered | Crosshatch Poplin',
    image: require('../assets/images/brand/product.jpg'),
    price: 3499,
    discountPrice: 4999,
    tag: '30% OFF',
  },
  {
    id: '2',
    name: 'Floral Print Cotton Shirt',
    image: require('../assets/images/brand/product.jpg'),
    price: 2799,
    discountPrice: 3999,
    tag: '30% OFF',
  },
  {
    id: '3',
    name: 'Denim Blue Jeans',
    image: require('../assets/images/brand/product.jpg'),
    price: 1999,
    discountPrice: 2499,
    tag: '20% OFF',
  },
  {
    id: '4',
    name: 'Classic White Sneakers',
    image: require('../assets/images/brand/product.jpg'),
    price: 4999,
    discountPrice: 5999,
    tag: '15% OFF',
  },
  {
    id: '5',
    name: 'Leather Wallet Brown',
    image: require('../assets/images/brand/product.jpg'),
    price: 1299,
    discountPrice: 1599,
    tag: '20% OFF',
  },
  {
    id: '6',
    name: 'Silk Scarf Patterned',
    image: require('../assets/images/brand/product.jpg'),
    price: 899,
    discountPrice: 1299,
    tag: '30% OFF',
  },
];


const comments = [
  {
    id: '1',
    user: 'Faizan',
    text: '🔥🔥 this is dope!',
    time: '2h ago',
    replies: [
      { id: 'r1', user: 'Ayesha', text: 'Hahaha Faizan 😏… kya hum dosti kar saktay hain?', time: '1h ago' },
      { id: 'r2', user: 'Zain', text: '🔥🔥🔥', time: '30m ago' }
    ]
  },
  {
    id: '2',
    user: 'Muqadis',
    text: 'Love this vibe 😍',
    time: '4h ago',
    replies: [
      { id: 'r3', user: 'Sana', text: 'Me too!', time: '3h ago' }
    ]
  },
  { id: '3', user: 'Ayesha', text: 'You killed it! 💯', time: '5h ago' },
  { id: '4', user: 'Zain', text: 'Bro this transition is crazy 🤯', time: '1h ago' },
  {
    id: '5',
    user: 'Ali',
    text: 'Keep it up king 👑',
    time: '3h ago',
    replies: [
      { id: 'r4', user: 'Hamza', text: 'Absolutely!', time: '2h ago' },
      { id: 'r5', user: 'Sara', text: '🔥🔥', time: '1h ago' }
    ]
  },
  { id: '6', user: 'Sana', text: 'Can’t stop watching this 🔁', time: '2h ago' },
  { id: '7', user: 'Ahmed', text: 'Clean edit 🔥', time: '6h ago' },
  { id: '8', user: 'Maira', text: 'Where is this place? 😍', time: '3h ago' },
  { id: '9', user: 'Daniyal', text: 'Music fits perfectly 🎶', time: '1h ago' },
  { id: '10', user: 'Hina', text: 'Aesthetic goals ✨', time: '5h ago' },
  { id: '11', user: 'Usman', text: 'Bro teach me this effect 🙌', time: '7h ago' },
  { id: '12', user: 'Nadia', text: 'Underrated content 🔥', time: '4h ago' },
  { id: '13', user: 'Bilal', text: 'Pure talent right here 👏', time: '3h ago' },
  { id: '14', user: 'Tania', text: 'That timing tho 😮', time: '2h ago' },
  { id: '15', user: 'Hassan', text: 'Smooth af 😎', time: '8h ago' },
  { id: '16', user: 'Sara', text: 'Can’t believe this isn’t trending yet 😤', time: '1h ago' },
  { id: '17', user: 'Kashan', text: 'Why isn’t this viral already?? 💥', time: '9h ago' },
  { id: '18', user: 'Rida', text: 'So satisfying to watch 🤩', time: '5h ago' },
  { id: '19', user: 'Hamza', text: 'Bro camera quality 🔥🔥🔥', time: '7h ago' },
  { id: '20', user: 'Zoya', text: 'I’ve watched this 5 times already 😂', time: '4h ago' },
  { id: '21', user: 'Anas', text: 'The vibes are immaculate 💫', time: '6h ago' },
  { id: '22', user: 'Laiba', text: 'That beat drop tho 😍🔥', time: '2h ago' },
  { id: '23', user: 'Imran', text: 'Insane edit bro 🔥🔥🔥', time: '1h ago' },
  { id: '24', user: 'Noor', text: 'So cool 😎 where did you shoot this?', time: '3h ago' },
  { id: '25', user: 'Rehan', text: 'Legendary stuff 👏👏', time: '8h ago' },
  { id: '26', user: 'Hira', text: 'Love your content always ❤️', time: '7h ago' },
  { id: '27', user: 'Omar', text: 'This deserves more likes 💯', time: '9h ago' },
  { id: '28', user: 'Iqra', text: 'That transition 😍🔥', time: '5h ago' },
  { id: '29', user: 'Emaan', text: 'Bro dropped another masterpiece 🔥', time: '10h ago' },
  { id: '30', user: 'Faraz', text: 'This edit just hit different 💥', time: '6h ago' },
];


const categories = [
  {
    name: 'Fashion & Accessories',
    sub: [
      { name: 'Clothing', sub: ['Eastern Wear', 'Western Wear', 'Activewear', 'Loungewear', 'Modest Fashion'] },
      { name: 'Footwear', sub: ['Formal', 'Casual', 'Ethnic', 'Handmade', 'Sneakers'] },
      { name: 'Bags & Wallets', sub: ['Handbags', 'Totes', 'Backpacks', 'Wallets', 'Clutches'] },
      { name: 'Jewelry', sub: ['Gold-plated', 'Silver', 'Handmade', 'Beaded', 'Resin'] },
      { name: 'Watches & Smart Accessories', sub: ['Analog', 'Digital', 'Smart Bands'] },
      { name: 'Eyewear', sub: ['Sunglasses', 'Frames', 'Lenses'] },
      { name: 'Accessories', sub: ['Belts', 'Scarves', 'Caps', 'Socks', 'Ties', 'Dupattas'] },
    ],
  },
  {
    name: 'Home & Living',
    sub: [
      { name: 'Furniture', sub: ['Living Room', 'Bedroom', 'Office', 'Outdoor', 'Kids'] },
      { name: 'Décor', sub: ['Wall Art', 'Mirrors', 'Candles', 'Vases', 'Figurines'] },
      { name: 'Textiles', sub: ['Bedsheets', 'Cushions', 'Rugs', 'Curtains', 'Towels'] },
      { name: 'Kitchenware', sub: ['Cookware', 'Bakeware', 'Utensils', 'Storage Jars', 'Cutlery'] },
      { name: 'Home Improvement', sub: ['Shelves', 'Organizers', 'Hooks', 'Lighting'] },
      { name: 'Cleaning & Maintenance', sub: ['Mops', 'Detergents', 'Sprays', 'Tools'] },
    ],
  },
  {
    name: 'Beauty & Personal Care',
    sub: [
      { name: 'Skincare', sub: ['Creams', 'Face Wash', 'Toners', 'Serums', 'Scrubs'] },
      { name: 'Haircare', sub: ['Shampoos', 'Oils', 'Conditioners', 'Masks'] },
      { name: 'Bodycare', sub: ['Lotions', 'Soaps', 'Deodorants', 'Scrubs'] },
      { name: 'Makeup', sub: ['Foundations', 'Lipsticks', 'Blushes', 'Eye Products'] },
      { name: 'Fragrances', sub: ['Perfumes', 'Body Sprays', 'Attars'] },
      { name: 'Oral Care', sub: ['Toothpastes', 'Mouthwash', 'Toothbrushes'] },
      { name: 'Men’s Grooming', sub: ['Beard Oils', 'Trimmers', 'Aftershave', 'Skincare Kits'] },
      { name: 'Wellness', sub: ['Bath Salts', 'Massage Oils', 'Organic Products'] },
    ],
  },
  {
    name: 'Food & Packaged Goods',
    sub: [
      { name: 'Baked Goods', sub: ['Brownies', 'Cookies', 'Cupcakes', 'Bread'] },
      { name: 'Snacks', sub: ['Nimco', 'Chips', 'Roasted Nuts', 'Protein Bars'] },
      { name: 'Condiments', sub: ['Sauces', 'Ketchups', 'Chutneys', 'Spreads', 'Honey'] },
      { name: 'Packaged Meals', sub: ['Instant Noodles', 'Soups', 'Cereals'] },
      { name: 'Beverages', sub: ['Juices', 'Teas', 'Coffees', 'Instant Mixes'] },
      { name: 'Spices & Seasonings', sub: ['National', 'Shan', 'Artisan Spice Mixes'] },
      { name: 'Dry Fruits & Ingredients', sub: ['Nuts', 'Seeds', 'Lentils', 'Pulses'] },
      { name: 'Health Foods', sub: ['Granola', 'Protein Powders', 'Herbal Teas'] },
    ],
  },
  {
    name: 'FMCG & Everyday Essentials',
    sub: [
      { name: 'Household Care', sub: ['Detergents', 'Dishwashing', 'Disinfectants'] },
      { name: 'Personal Hygiene', sub: ['Sanitary Pads', 'Soaps', 'Handwashes'] },
      { name: 'Toiletries', sub: ['Tissues', 'Cotton', 'Wipes'] },
      { name: 'Shoe Care', sub: ['Polishes', 'Brushes', 'Protectors'] },
      { name: 'Insect & Air Care', sub: ['Sprays', 'Repellents', 'Fresheners'] },
    ],
  },
  {
    name: 'DIY, Stationery & Hobbies',
    sub: [
      { name: 'Stationery', sub: ['Notebooks', 'Planners', 'Pens', 'Markers'] },
      { name: 'Craft Supplies', sub: ['Paints', 'Brushes', 'Canvas', 'Glue', 'Beads'] },
      { name: 'DIY Kits', sub: ['Home Décor', 'Kids’ Crafts', 'Resin Art', 'Candle-Making'] },
      { name: 'Art Prints & Originals', sub: ['Illustrations', 'Paintings', 'Posters'] },
      { name: 'Gift Wrapping', sub: ['Boxes', 'Ribbons', 'Wrapping Paper'] },
    ],
  },
  {
    name: 'Books & Education',
    sub: [
      { name: 'Books', sub: ['Fiction', 'Non-fiction', 'Islamic', 'Self-help', 'Kids’ Books'] },
      { name: 'Learning Materials', sub: ['Flashcards', 'Puzzles', 'Workbooks'] },
      { name: 'Notebooks & Journals', sub: ['Bullet Journals', 'Diaries', 'Sketchpads'] },
    ],
  },
  {
    name: 'Gifts, Bouquets & Celebrations',
    sub: [
      { name: 'Flowers', sub: ['Fresh Bouquets', 'Dried Arrangements', 'Artificial'] },
      { name: 'Gift Sets', sub: ['Chocolates', 'Candles', 'Hampers'] },
      { name: 'Cards & Wrapping', sub: ['Stationery', 'Ribbons', 'Tags'] },
      { name: 'Personalized Gifts', sub: ['Name-based', 'Photo-based', 'Engraved Items'] },
      { name: 'Party Décor', sub: ['Balloons', 'Banners', 'Props'] },
    ],
  },
  {
    name: 'Kids & Babies',
    sub: [
      { name: 'Clothing', sub: ['Casual', 'Ethnic', 'Sleepwear'] },
      { name: 'Toys', sub: ['Educational', 'Plush', 'Wooden', 'Puzzles'] },
      { name: 'Baby Care', sub: ['Lotions', 'Wipes', 'Baby Food', 'Bottles'] },
      { name: 'School Supplies', sub: ['Bags', 'Bottles', 'Lunch Boxes'] },
    ],
  },
  {
    name: 'Pet Care',
    sub: [
      { name: 'Food', sub: ['Dogs', 'Cats', 'Birds', 'Fish'] },
      { name: 'Accessories', sub: ['Collars', 'Leashes', 'Beds', 'Toys'] },
      { name: 'Grooming', sub: ['Shampoos', 'Brushes', 'Sprays'] },
    ],
  },
  {
    name: 'Light Electronics & Accessories',
    sub: [
      { name: 'Mobile Accessories', sub: ['Chargers', 'Cases', 'Holders', 'Cables'] },
      { name: 'Small Home Gadgets', sub: ['Blenders', 'Irons', 'Lights'] },
      { name: 'Audio', sub: ['Earphones', 'Speakers', 'Bluetooth Devices'] },
      { name: 'Smart Home', sub: ['Lamps', 'Diffusers', 'Humidifiers'] },
      { name: 'Decorative Tech', sub: ['LED Lights', 'Clocks', 'Mini Fans'] },
    ],
  },
  {
    name: 'Local, Handmade & Artisan Products',
    sub: [
      { name: 'Handicrafts', sub: ['Pottery', 'Embroidery', 'Baskets', 'Rugs'] },
      { name: 'Sustainable Goods', sub: ['Eco-friendly Packaging', 'Bamboo Items'] },
      { name: 'Cultural Goods', sub: ['Peshawari Chappal', 'Sindhi Ajrak', 'Multani Art'] },
      { name: 'Organic & Natural', sub: ['Oils', 'Soaps', 'Teas', 'Spices'] },
    ],
  },
  {
    name: 'Health & Wellness',
    sub: [
      { name: 'Supplements', sub: ['Vitamins', 'Protein', 'Herbal'] },
      { name: 'Fitness Products', sub: ['Mats', 'Resistance Bands'] },
      { name: 'Herbal Remedies', sub: ['Desi Totkas', 'Ayurvedic', 'Tibb-e-Nabvi'] },
      { name: 'Wellness Foods', sub: ['Herbal Teas', 'Organic Honey', 'Immunity Boosters'] },
    ],
  },
  {
    name: 'Seasonal & Festive',
    sub: [
      { name: 'Ramzan Specials', sub: ['Dates', 'Gift Boxes', 'Prayer Mats'] },
      { name: 'Eid Collections', sub: ['Clothing', 'Décor', 'Gifting'] },
      { name: 'Wedding Season', sub: ['Décor', 'Gifts', 'Jewelry', 'Packaging'] },
      { name: 'Winter Specials', sub: ['Shawls', 'Heaters', 'Blankets'] },
      { name: 'Festive Crafts', sub: ['Handmade Cards', 'Candles', 'Decorations'] },
    ],
  },
];


const dummyPosts = [
  {
    id: '1',
    username: 'karachi_bazar',
    userAvatar: require('@/assets/images/stories/1.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762684189376-148114123.jpeg",
    caption: 'Fresh vegetables straight from the farm 🥦🥕',
    likes: 325,
    timeAgo: '2 hours ago',
    price: 'Rs. 899',
    discountPrice: 'Rs. 699',
  },
  {
    id: '2',
    username: 'lahore_style',
    userAvatar: require('@/assets/images/stories/2.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    caption: 'Trendy kurtas for this festive season 👕✨',
    likes: 480,
    timeAgo: '5 hours ago',
    price: 'Rs. 1499',
    discountPrice: 'Rs. 1199',
  },
  {
    id: '3',
    username: 'seafood_delight',
    userAvatar: require('@/assets/images/stories/3.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    caption: 'Fresh prawns delivered daily from the port 🦐🌊',
    likes: 612,
    timeAgo: '1 day ago',
    price: 'Rs. 2499',
    discountPrice: 'Rs. 1999',
  },
  {
    id: '4',
    username: 'tech_corner',
    userAvatar: require('@/assets/images/stories/4.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    caption: 'Hot deals on latest smartphones 📱🔥',
    likes: 842,
    timeAgo: '3 hours ago',
    price: 'Rs. 79,999',
    discountPrice: 'Rs. 69,999',
  },
  {
    id: '5',
    username: 'beauty_glow',
    userAvatar: require('@/assets/images/stories/5.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    caption: 'Summer skincare combo 💧☀️ — stay fresh all day!',
    likes: 298,
    timeAgo: '8 hours ago',
    price: 'Rs. 2499',
    discountPrice: 'Rs. 1799',
  },
  {
    id: '6',
    username: 'sports_zone',
    userAvatar: require('@/assets/images/stories/2.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    caption: 'New arrivals: footballs, jerseys & more ⚽️👕',
    likes: 723,
    timeAgo: '6 hours ago',
    price: 'Rs. 2999',
    discountPrice: 'Rs. 2299',
  },
  {
    id: '7',
    username: 'home_mart',
    userAvatar: require('@/assets/images/stories/3.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    caption: 'Stylish lamps for your cozy nights 🕯️💫',
    likes: 410,
    timeAgo: '10 hours ago',
    price: 'Rs. 4499',
    discountPrice: 'Rs. 3499',
  },
  {
    id: '8',
    username: 'fashion_fever',
    userAvatar: require('@/assets/images/stories/4.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    caption: 'Get your summer look sorted 👗🌼',
    likes: 580,
    timeAgo: '1 day ago',
    price: 'Rs. 3299',
    discountPrice: 'Rs. 2599',
  },
  {
    id: '9',
    username: 'daily_deals_pk',
    userAvatar: require('@/assets/images/stories/5.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    caption: 'Everything under Rs. 999! 🎉🔥',
    likes: 999,
    timeAgo: '3 days ago',
    price: 'Rs. 999',
    discountPrice: 'Rs. 749',
  },
  {
    id: '10',
    username: 'tech_trendz',
    userAvatar: require('@/assets/images/stories/1.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    caption: 'Upgrade your setup 💻🔌 — laptops on discount!',
    likes: 672,
    timeAgo: '2 days ago',
    price: 'Rs. 119,999',
    discountPrice: 'Rs. 104,999',
  },
  {
    id: '11',
    username: 'fashion_corner',
    userAvatar: require('@/assets/images/stories/1.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    likes: 328,
    caption: 'New winter collection is out! 🧥❄️',
    timeAgo: '2 hours ago',
    price: 3200,
    discountPrice: 2599,
  },
  {
    id: '12',
    username: 'tech_zone',
    userAvatar: require('@/assets/images/stories/2.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    likes: 478,
    caption: 'Grab the latest gadgets at unbeatable prices ⚡️',
    timeAgo: '5 hours ago',
    price: 5600,
    discountPrice: 4999,
  },
  {
    id: '13',
    username: 'glow_beauty',
    userAvatar: require('@/assets/images/stories/3.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    likes: 612,
    caption: 'Skincare deals that shine ✨',
    timeAgo: '1 day ago',
    price: 2400,
    discountPrice: 1899,
  },
  {
    id: '14',
    username: 'urban_home',
    userAvatar: require('@/assets/images/stories/4.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    likes: 399,
    caption: 'Modern furniture at your doorstep 🛋️',
    timeAgo: '3 hours ago',
    price: 8700,
    discountPrice: 7399,
  },
  {
    id: '15',
    username: 'sneaker_world',
    userAvatar: require('@/assets/images/stories/5.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    likes: 721,
    caption: 'Step up your shoe game 👟🔥',
    timeAgo: '6 hours ago',
    price: 6200,
    discountPrice: 5199,
  },
  {
    id: '16',
    username: 'trendify_store',
    userAvatar: require('@/assets/images/stories/1.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    likes: 284,
    caption: 'Casual fits for every day 👕',
    timeAgo: '4 hours ago',
    price: 1800,
    discountPrice: 1399,
  },
  {
    id: '17',
    username: 'daily_fresh',
    userAvatar: require('@/assets/images/stories/2.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    likes: 198,
    caption: 'Fresh veggies and more 🥬🥕',
    timeAgo: '7 hours ago',
    price: 999,
    discountPrice: 749,
  },
  {
    id: '18',
    username: 'bookish_corner',
    userAvatar: require('@/assets/images/stories/3.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    likes: 355,
    caption: 'Get lost in a new story 📚',
    timeAgo: '10 hours ago',
    price: 2200,
    discountPrice: 1799,
  },
  {
    id: '19',
    username: 'sports_vibe',
    userAvatar: require('@/assets/images/stories/4.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",

    likes: 507,
    caption: 'Gear up for the field 🏏🏀⚽',
    timeAgo: '2 days ago',
    price: 3400,
    discountPrice: 2899,
  },
  {
    id: '20',
    username: 'handmade_hub',
    userAvatar: require('@/assets/images/stories/5.jpg'),
    postImage: "https://farokht-node-backend-293120138913.europe-west1.run.app/api/v1/bucket/files/1762593276912-30461751.jpeg",
    likes: 276,
    caption: 'Beautiful handmade crafts ❤️',
    timeAgo: '3 days ago',
    price: 1500,
    discountPrice: 1199,
  },

]
const cartItems = [
  {
    id: '1',
    title: 'Premium Leather Handbag',
    shortDesc: 'Elegant leather for everyday style.',
    image: require('@/assets/images/post.jpg'),
    price: 2499,
    discountPrice: 1899,
    qty: 1,
    brand: 'Royal Brands'
  },
  {
    id: '1',
    title: 'Premium Leather Handbag',
    shortDesc: 'Elegant leather for everyday style.',
    image: require('@/assets/images/post.jpg'),
    price: 2499,
    discountPrice: 1899,
    qty: 1,
    brand: 'Royal Brands'
  },
  {
    id: '1',
    title: 'Premium Leather Handbag',
    shortDesc: 'Elegant leather for everyday style.',
    image: require('@/assets/images/post.jpg'),
    price: 2499,
    discountPrice: 1899,
    qty: 1,
    brand: 'Royal Brands'
  },
  {
    id: '1',
    title: 'Premium Leather Handbag',
    shortDesc: 'Elegant leather for everyday style.',
    image: require('@/assets/images/post.jpg'),
    price: 2499,
    discountPrice: 1899,
    qty: 1,
    brand: 'Royal Brands'
  },
  {
    id: '1',
    title: 'Premium Leather Handbag',
    shortDesc: 'Elegant leather for everyday style.',
    image: require('@/assets/images/post.jpg'),
    price: 2499,
    discountPrice: 1899,
    qty: 1,
    brand: 'Royal Brands'
  },
  {
    id: '2',
    title: "Men's Denim Jacket",
    shortDesc: 'Classic fit, perfect for all seasons.',
    image: require('@/assets/images/post.jpg'),
    price: 4800,
    discountPrice: 3999,
    qty: 2,
    brand: "DenimCo"
  }
]
const posts = [
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
  {
    id: 1,
    url: 'https://picsum.photos/400/600?random=1',
    videoThumbnail: '',
    title: 'Casual Outfit',
    description: 'Perfect look for a weekend brunch.',
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/600?random=2',
    videoThumbnail: '',
    title: 'Street Style',
    description: 'Urban-inspired outfit for daily wear.',
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/600?random=3',
    videoThumbnail: '',
    title: 'Reel Video Sample',
  },
  {
    id: 4,
    url: 'https://picsum.photos/400/600?random=5',
    videoThumbnail: '',
    title: 'Brand Story',
  },
];


const products = [
  {
    id: 1,
    title: 'Classic Denim Jacket',
    price: 5500,
    discountedPrice: 4200,
    url: 'https://picsum.photos/400/600?random=10',
  },
  {
    id: 2,
    title: 'White Sneakers',
    price: 6500,
    discountedPrice: 5800,
    url: 'https://picsum.photos/400/600?random=11',
  },
  {
    id: 3,
    title: 'Leather Handbag',
    price: 8500,
    discountedPrice: 0,
    url: 'https://picsum.photos/400/600?random=12',
  },
  {
    id: 4,
    title: 'Black Hoodie',
    price: 4800,
    discountedPrice: 4300,
    url: 'https://picsum.photos/400/600?random=13',
  },
  {
    id: 5,
    title: 'Smart Watch',
    price: 12000,
    discountedPrice: 9999,
    url: 'https://picsum.photos/400/600?random=14',
  },
  {
    id: 6,
    title: 'Casual T-Shirt',
    price: 2500,
    discountedPrice: 2000,
    url: 'https://picsum.photos/400/600?random=15',
  },
  {
    id: 1,
    title: 'Classic Denim Jacket',
    price: 5500,
    discountedPrice: 4200,
    url: 'https://picsum.photos/400/600?random=10',
  },
  {
    id: 2,
    title: 'White Sneakers',
    price: 6500,
    discountedPrice: 5800,
    url: 'https://picsum.photos/400/600?random=11',
  },
  {
    id: 3,
    title: 'Leather Handbag',
    price: 8500,
    discountedPrice: 0,
    url: 'https://picsum.photos/400/600?random=12',
  },
  {
    id: 4,
    title: 'Black Hoodie',
    price: 4800,
    discountedPrice: 4300,
    url: 'https://picsum.photos/400/600?random=13',
  },
  {
    id: 5,
    title: 'Smart Watch',
    price: 12000,
    discountedPrice: 9999,
    url: 'https://picsum.photos/400/600?random=14',
  },
  {
    id: 6,
    title: 'Casual T-Shirt',
    price: 2500,
    discountedPrice: 2000,
    url: 'https://picsum.photos/400/600?random=15',
  },
  {
    id: 1,
    title: 'Classic Denim Jacket',
    price: 5500,
    discountedPrice: 4200,
    url: 'https://picsum.photos/400/600?random=10',
  },
  {
    id: 2,
    title: 'White Sneakers',
    price: 6500,
    discountedPrice: 5800,
    url: 'https://picsum.photos/400/600?random=11',
  },
  {
    id: 3,
    title: 'Leather Handbag',
    price: 8500,
    discountedPrice: 0,
    url: 'https://picsum.photos/400/600?random=12',
  },
  {
    id: 4,
    title: 'Black Hoodie',
    price: 4800,
    discountedPrice: 4300,
    url: 'https://picsum.photos/400/600?random=13',
  },
  {
    id: 5,
    title: 'Smart Watch',
    price: 12000,
    discountedPrice: 9999,
    url: 'https://picsum.photos/400/600?random=14',
  },
  {
    id: 6,
    title: 'Casual T-Shirt',
    price: 2500,
    discountedPrice: 2000,
    url: 'https://picsum.photos/400/600?random=15',
  },
];

export { cartItems, categories, comments, dashboard, dummyPosts, dummyProducts, posts, products, sizeOrder, statuses, tabs };


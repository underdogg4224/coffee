// Coffee products database with detailed flavor profiles
const coffeeProducts = [
    {
        id: 1,
        name: "Ethiopian Yirgacheffe",
        roast: "light",
        description: "A bright, floral coffee with hints of blueberry and jasmine. Known for its wine-like acidity and clean finish.",
        flavors: ["fruity", "floral"],
        intensity: "bright",
        brewMethods: ["pour-over", "aeropress", "cold-brew"],
        origin: "Ethiopia",
        body: "light"
    },
    {
        id: 2,
        name: "Colombian Supremo",
        roast: "medium",
        description: "Balanced and smooth with caramel sweetness and nutty undertones. A versatile, crowd-pleasing coffee.",
        flavors: ["nutty", "caramel"],
        intensity: "balanced",
        brewMethods: ["drip", "pour-over", "espresso"],
        origin: "Colombia",
        body: "medium"
    },
    {
        id: 3,
        name: "Sumatra Mandheling",
        roast: "dark",
        description: "Full-bodied and earthy with notes of dark chocolate and herbs. Low acidity with a syrupy mouthfeel.",
        flavors: ["earthy", "chocolatey"],
        intensity: "bold",
        brewMethods: ["french-press", "espresso", "moka-pot"],
        origin: "Indonesia",
        body: "full"
    },
    {
        id: 4,
        name: "Kenya AA",
        roast: "medium",
        description: "Vibrant and complex with black currant and citrus notes. Bright acidity with a winey character.",
        flavors: ["fruity", "citrus"],
        intensity: "bright",
        brewMethods: ["pour-over", "drip", "aeropress"],
        origin: "Kenya",
        body: "medium"
    },
    {
        id: 5,
        name: "Brazil Santos",
        roast: "medium",
        description: "Nutty and sweet with chocolate notes and low acidity. Creamy body perfect for espresso blends.",
        flavors: ["nutty", "chocolatey"],
        intensity: "smooth",
        brewMethods: ["espresso", "drip", "french-press"],
        origin: "Brazil",
        body: "medium"
    },
    {
        id: 6,
        name: "Costa Rican Tarrazu",
        roast: "medium-light",
        description: "Clean and crisp with honey sweetness and citrus brightness. Well-balanced with a smooth finish.",
        flavors: ["citrus", "honey"],
        intensity: "balanced",
        brewMethods: ["pour-over", "drip", "aeropress"],
        origin: "Costa Rica",
        body: "medium"
    },
    {
        id: 7,
        name: "Guatemala Antigua",
        roast: "medium-dark",
        description: "Rich and spicy with chocolate and smoky notes. Full-bodied with a pleasant acidity.",
        flavors: ["chocolatey", "spicy"],
        intensity: "bold",
        brewMethods: ["french-press", "espresso", "drip"],
        origin: "Guatemala",
        body: "full"
    },
    {
        id: 8,
        name: "Hawaiian Kona",
        roast: "medium",
        description: "Smooth and mellow with subtle fruit notes and nutty undertones. Low acidity with a clean taste.",
        flavors: ["nutty", "subtle-fruit"],
        intensity: "smooth",
        brewMethods: ["drip", "pour-over", "french-press"],
        origin: "Hawaii",
        body: "medium"
    },
    {
        id: 9,
        name: "Rwanda Bourbon",
        roast: "light-medium",
        description: "Fruity and floral with notes of berries and orange. Sweet and complex with a tea-like body.",
        flavors: ["fruity", "floral"],
        intensity: "bright",
        brewMethods: ["pour-over", "aeropress", "cold-brew"],
        origin: "Rwanda",
        body: "light"
    },
    {
        id: 10,
        name: "Italian Dark Roast",
        roast: "dark",
        description: "Bold and smoky with dark chocolate and roasted nut flavors. Low acidity, perfect for espresso.",
        flavors: ["chocolatey", "roasted"],
        intensity: "bold",
        brewMethods: ["espresso", "moka-pot", "french-press"],
        origin: "Blend",
        body: "full"
    },
    {
        id: 11,
        name: "Panama Geisha",
        roast: "light",
        description: "Exotic and delicate with jasmine, bergamot, and tropical fruit notes. Highly aromatic and refined.",
        flavors: ["floral", "fruity"],
        intensity: "delicate",
        brewMethods: ["pour-over", "aeropress", "cold-brew"],
        origin: "Panama",
        body: "light"
    },
    {
        id: 12,
        name: "Vietnamese Robusta",
        roast: "dark",
        description: "Strong and bold with earthy, woody notes and hints of dark chocolate. High caffeine content.",
        flavors: ["earthy", "chocolatey"],
        intensity: "intense",
        brewMethods: ["vietnamese-phin", "espresso", "cold-brew"],
        origin: "Vietnam",
        body: "full"
    },
    {
        id: 13,
        name: "Mexican Chiapas",
        roast: "medium",
        description: "Smooth and delicate with nutty and chocolate notes. Mild acidity with a pleasant sweetness.",
        flavors: ["nutty", "chocolatey"],
        intensity: "smooth",
        brewMethods: ["drip", "pour-over", "french-press"],
        origin: "Mexico",
        body: "medium"
    },
    {
        id: 14,
        name: "Tanzanian Peaberry",
        roast: "medium-light",
        description: "Bright and lively with blackcurrant and citrus flavors. Clean finish with wine-like acidity.",
        flavors: ["fruity", "citrus"],
        intensity: "bright",
        brewMethods: ["pour-over", "aeropress", "drip"],
        origin: "Tanzania",
        body: "medium"
    },
    {
        id: 15,
        name: "French Roast",
        roast: "dark",
        description: "Intensely dark with smoky, bittersweet chocolate notes. Bold and robust with minimal acidity.",
        flavors: ["roasted", "chocolatey"],
        intensity: "bold",
        brewMethods: ["french-press", "drip", "espresso"],
        origin: "Blend",
        body: "full"
    }
];

// Quiz questions structure
const quizQuestions = [
    {
        id: 1,
        question: "What flavor profile appeals to you most?",
        type: "single",
        category: "flavor",
        answers: [
            {
                value: "fruity",
                label: "Fruity & Bright",
                icon: "🍓",
                description: "Berry, citrus, and wine-like notes",
                weight: 3
            },
            {
                value: "chocolatey",
                label: "Chocolatey & Rich",
                icon: "🍫",
                description: "Dark chocolate and cocoa flavors",
                weight: 3
            },
            {
                value: "nutty",
                label: "Nutty & Smooth",
                icon: "🥜",
                description: "Almond, hazelnut, and caramel notes",
                weight: 3
            },
            {
                value: "earthy",
                label: "Earthy & Herbal",
                icon: "🌿",
                description: "Woody, spicy, and earthy tones",
                weight: 3
            }
        ]
    },
    {
        id: 2,
        question: "How do you usually brew your coffee?",
        type: "single",
        category: "brewing",
        answers: [
            {
                value: "espresso",
                label: "Espresso Machine",
                icon: "☕",
                description: "Concentrated and intense",
                weight: 2
            },
            {
                value: "drip",
                label: "Drip Coffee Maker",
                icon: "☕",
                description: "Classic and convenient",
                weight: 2
            },
            {
                value: "pour-over",
                label: "Pour Over",
                icon: "🫗",
                description: "Manual and precise",
                weight: 2
            },
            {
                value: "french-press",
                label: "French Press",
                icon: "🫖",
                description: "Full-bodied and rich",
                weight: 2
            },
            {
                value: "cold-brew",
                label: "Cold Brew",
                icon: "🧊",
                description: "Smooth and refreshing",
                weight: 2
            }
        ]
    },
    {
        id: 3,
        question: "What roast level do you prefer?",
        type: "single",
        category: "roast",
        answers: [
            {
                value: "light",
                label: "Light Roast",
                icon: "🟤",
                description: "Bright, acidic, and complex",
                weight: 3
            },
            {
                value: "medium",
                label: "Medium Roast",
                icon: "🟫",
                description: "Balanced and versatile",
                weight: 3
            },
            {
                value: "dark",
                label: "Dark Roast",
                icon: "⚫",
                description: "Bold, smoky, and robust",
                weight: 3
            }
        ]
    },
    {
        id: 4,
        question: "How do you like your coffee's intensity?",
        type: "single",
        category: "intensity",
        answers: [
            {
                value: "delicate",
                label: "Delicate & Subtle",
                icon: "🌸",
                description: "Light and nuanced flavors",
                weight: 2
            },
            {
                value: "balanced",
                label: "Balanced & Smooth",
                icon: "⚖️",
                description: "Well-rounded and easy drinking",
                weight: 2
            },
            {
                value: "bold",
                label: "Bold & Strong",
                icon: "💪",
                description: "Powerful and intense",
                weight: 2
            }
        ]
    },
    {
        id: 5,
        question: "Any additional flavor notes you enjoy?",
        type: "multiple",
        category: "secondary-flavors",
        answers: [
            {
                value: "floral",
                label: "Floral",
                icon: "🌺",
                description: "Jasmine, lavender, rose",
                weight: 1
            },
            {
                value: "citrus",
                label: "Citrus",
                icon: "🍊",
                description: "Orange, lemon, lime",
                weight: 1
            },
            {
                value: "caramel",
                label: "Caramel",
                icon: "🍮",
                description: "Sweet and buttery",
                weight: 1
            },
            {
                value: "spicy",
                label: "Spicy",
                icon: "🌶️",
                description: "Cinnamon, pepper, clove",
                weight: 1
            }
        ]
    }
];

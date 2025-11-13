# ☕ Coffee Flavor Profile Matcher

An interactive quiz application that helps customers discover their perfect coffee match based on their taste preferences, brewing methods, and roast preferences.

## Features

- **Interactive Quiz**: 5 carefully crafted questions about flavor profiles, brewing methods, roast levels, and intensity preferences
- **Smart Matching Algorithm**: Sophisticated scoring system that matches user preferences with 15 different coffee varieties
- **Personalized Recommendations**: Get top 5 coffee recommendations ranked by compatibility percentage
- **Beautiful UI**: Modern, responsive design with smooth animations and intuitive navigation
- **Mobile-Friendly**: Fully responsive design that works on all devices

## How It Works

1. **Welcome Screen**: Users are greeted and invited to start the quiz
2. **Quiz Questions**: Users answer 5 questions about:
   - Primary flavor preferences (Fruity, Chocolatey, Nutty, Earthy)
   - Brewing method (Espresso, Drip, Pour Over, French Press, Cold Brew)
   - Roast level (Light, Medium, Dark)
   - Coffee intensity (Delicate, Balanced, Bold)
   - Secondary flavor notes (Floral, Citrus, Caramel, Spicy)
3. **Results**: Algorithm calculates compatibility scores and displays top 5 coffee matches with detailed descriptions

## Coffee Database

The application features 15 premium coffee varieties from around the world:

- Ethiopian Yirgacheffe (Light Roast - Fruity & Floral)
- Colombian Supremo (Medium Roast - Nutty & Caramel)
- Sumatra Mandheling (Dark Roast - Earthy & Chocolatey)
- Kenya AA (Medium Roast - Fruity & Citrus)
- Brazil Santos (Medium Roast - Nutty & Chocolatey)
- Costa Rican Tarrazu (Medium-Light Roast - Citrus & Honey)
- Guatemala Antigua (Medium-Dark Roast - Chocolatey & Spicy)
- Hawaiian Kona (Medium Roast - Nutty & Subtle Fruit)
- Rwanda Bourbon (Light-Medium Roast - Fruity & Floral)
- Italian Dark Roast (Dark Roast - Chocolatey & Roasted)
- Panama Geisha (Light Roast - Floral & Fruity)
- Vietnamese Robusta (Dark Roast - Earthy & Chocolatey)
- Mexican Chiapas (Medium Roast - Nutty & Chocolatey)
- Tanzanian Peaberry (Medium-Light Roast - Fruity & Citrus)
- French Roast (Dark Roast - Roasted & Chocolatey)

## Matching Algorithm

The algorithm uses a weighted scoring system:

- **Primary Flavor Match**: 30 points
- **Roast Level Match**: 25 points
- **Brewing Method Compatibility**: 20 points
- **Intensity Preference**: 15 points
- **Secondary Flavors**: 5 points each

Each coffee is scored out of 100, and the match percentage helps users understand compatibility.

## File Structure

```
coffee/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── coffee-data.js      # Coffee products database and quiz questions
├── quiz.js            # Quiz logic and matching algorithm
└── README.md          # This file
```

## How to Use

1. Open `index.html` in any modern web browser
2. Click "Start Quiz" to begin
3. Answer all 5 questions by selecting your preferences
4. Navigate using "Previous" and "Next" buttons
5. View your personalized coffee recommendations
6. Click "Take Quiz Again" to restart

## Technical Details

- **Pure JavaScript**: No frameworks or dependencies required
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Smooth Animations**: CSS transitions and animations for better UX
- **Accessible**: Semantic HTML and keyboard navigation support

## Customization

### Adding New Coffee Products

Edit `coffee-data.js` and add new coffee objects to the `coffeeProducts` array:

```javascript
{
    id: 16,
    name: "Your Coffee Name",
    roast: "medium", // light, medium, dark, or combinations
    description: "Detailed description of flavor profile",
    flavors: ["flavor1", "flavor2"], // Array of flavor tags
    intensity: "balanced", // delicate, balanced, bright, smooth, bold, intense
    brewMethods: ["method1", "method2"], // Compatible brewing methods
    origin: "Country",
    body: "medium" // light, medium, full
}
```

### Modifying Quiz Questions

Edit the `quizQuestions` array in `coffee-data.js` to add, remove, or modify questions.

### Styling Changes

All styles are in `styles.css`. CSS custom properties (variables) are defined at the top for easy color scheme customization:

```css
:root {
    --primary-color: #6F4E37;
    --secondary-color: #A0826D;
    --accent-color: #D4A574;
    /* ... more variables */
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential features to add:
- Save results to local storage
- Share results on social media
- Email recommendations
- Add to cart functionality
- Integration with e-commerce platform
- User accounts and saved preferences
- More detailed coffee information (price, availability, etc.)
- Flavor wheel visualization
- Coffee brewing guides
- Video tutorials for brewing methods

## License

This project is open source and available for use in your coffee e-commerce applications.

## Credits

Created for coffee enthusiasts who want to discover their perfect brew! ☕

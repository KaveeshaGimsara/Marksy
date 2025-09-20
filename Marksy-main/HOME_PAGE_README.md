# Marksy - Student Dashboard Home Page

A clean, modern, responsive home page for a student dashboard app. This page is production-ready, mobile-first, and optimized for performance and SEO.

## 🚀 Features

### Core Features
- **📢 Responsive Notice Board** - Admin-editable notices with priority pins and timestamps
- **📊 Last Paper & Marks Summary** - Recent paper results with progress visuals
- **📈 Live Statistics** - Overall average, highest mark, trend sparklines, completion rate
- **⏰ Real-time Clock & Date** - Live updates with user locale/timezone
- **👋 Personalized Greeting** - Dynamic greeting based on stored user name
- **🔗 Quick Access Navigation** - Easy access to all app sections
- **💭 Motivational Quotes** - 100+ curated quotes with random generator
- **📅 Events Section** - Upcoming events with countdown timers
- **💼 Advertisement CTA** - Footer contact for advertising opportunities
- **📤 Export/Import Hooks** - UI for data export and import functionality

### Technical Features
- **📱 Mobile-First Design** - Optimized for all screen sizes
- **🎨 Modern UI/UX** - Clean, minimal aesthetic with smooth micro-interactions
- **♿ Accessibility** - Semantic HTML, ARIA attributes, keyboard navigation
- **🔍 SEO Optimized** - Meta tags, structured data, performance optimized
- **⚡ Performance** - Lightweight, fast-loading components

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **date-fns** for date formatting
- **Framer Motion** for animations

## 📁 Project Structure

```
src/
├── components/
│   └── HomePage.tsx          # Main home page component
├── data/
│   └── homePageData.ts       # Admin-configurable data
├── pages/
│   └── Index.tsx             # App routing and navigation
└── index.html                # SEO-optimized HTML template
```

## 🎯 Quick Start

### 1. Installation

```bash
# Navigate to project directory
cd Marksy-main

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Access the Application

Open your browser and navigate to `http://localhost:8080`

The home page will be the default view when you access the root URL.

## ⚙️ Admin Configuration

### Managing Notices

Edit the `adminNotices` array in `src/data/homePageData.ts`:

```typescript
export const adminNotices: Notice[] = [
  {
    id: "unique-id",
    title: "Your Notice Title",
    content: "Detailed notice content here...",
    priority: "important", // 'normal' | 'important' | 'exam' | 'event'
    timestamp: "2025-09-20T10:00:00Z", // ISO date string
    pinned: true // true for pinned notices
  }
  // Add more notices...
];
```

#### Notice Priority Colors:
- `normal` - Gray background
- `important` - Red background (urgent)
- `exam` - Orange background (exam-related)
- `event` - Blue background (events)

### Managing Events

Edit the `upcomingEvents` array in `src/data/homePageData.ts`:

```typescript
export const upcomingEvents: Event[] = [
  {
    id: "unique-id",
    title: "Event Name",
    date: "2025-09-25T09:00:00Z", // ISO date string
    type: "exam", // 'exam' | 'deadline' | 'event'
    description: "Optional event description"
  }
  // Add more events...
];
```

### Customizing Motivational Quotes

Replace or add to the `motivationalQuotes` array in `src/data/homePageData.ts`:

```typescript
export const motivationalQuotes = [
  "Your custom motivational quote here...",
  "Another inspiring message...",
  // Add 100+ quotes for variety
];
```

### Mock Data for Development

The `mockMarksData` object provides sample academic data for testing:

```typescript
export const mockMarksData: MockMarksData = {
  papers: [
    {
      id: "1",
      name: "Mathematics Quiz 3",
      subject: "Mathematics",
      date: "2025-09-18T00:00:00Z",
      marks: 87,
      totalMarks: 100
    }
    // Add more papers...
  ]
};
```

## 🎨 Customization

### Themes

The app supports light/dark themes using the existing `ThemeContext`. The home page automatically adapts to the current theme.

### Colors and Styling

Primary colors can be customized in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        // ... other shades
      }
    }
  }
}
```

### Layout and Spacing

The home page uses CSS Grid and Flexbox for responsive layouts. Key breakpoints:
- `sm:` 640px and up
- `md:` 768px and up  
- `lg:` 1024px and up

## 📊 Features Deep Dive

### Real-time Clock
- Updates every second using `setInterval`
- Shows time in HH:mm:ss format
- Displays full date with day of week
- Uses user's local timezone

### Statistics Dashboard
- **Overall Average**: Calculated from all papers
- **Highest Mark**: Best performance percentage
- **Trend Sparkline**: SVG-based mini chart of last 5 papers
- **Progress Bars**: Visual representation of performance

### Export Functionality
- Exports current dashboard data as JSON
- Includes stats, latest paper, notices, and events
- Downloads file with timestamp
- Ready for backend integration

### Countdown Timers
- Real-time countdown to upcoming events
- Shows days, hours, and minutes remaining
- Updates automatically
- Handles past events gracefully

## 🔧 Backend Integration Hooks

### API Endpoints (Ready for Implementation)

```typescript
// Example API structure for backend integration

// GET /api/notices - Fetch admin notices
// POST /api/notices - Create new notice
// PUT /api/notices/:id - Update notice
// DELETE /api/notices/:id - Delete notice

// GET /api/events - Fetch upcoming events
// POST /api/events - Create new event

// GET /api/papers - Fetch student papers
// POST /api/papers - Add new paper result

// GET /api/user/profile - Get user data
// POST /api/export - Export user data
// POST /api/import - Import user data
```

### State Management Hook Points

The following areas are ready for state management integration:

1. **User Authentication**: Replace `localStorage.getItem('userName')` with auth context
2. **Real-time Updates**: WebSocket integration for live notifications
3. **Data Persistence**: Replace mock data with API calls
4. **File Uploads**: Connect import functionality to file processing
5. **Analytics**: Add user interaction tracking

## 📱 Mobile Optimization

### Responsive Design Features
- Mobile-first CSS approach
- Touch-friendly button sizes (minimum 44px)
- Optimized text sizes for mobile reading
- Hamburger menu ready for mobile navigation
- Swipe gestures support ready

### Performance Optimizations
- Lazy loading for heavy components
- Optimized images and SVGs
- Minimal bundle size
- Critical CSS inlined
- Efficient re-rendering with React.memo

## ♿ Accessibility Features

### ARIA Support
- Semantic HTML structure
- ARIA labels and descriptions
- Focus management
- Screen reader friendly
- Keyboard navigation support

### Compliance
- WCAG 2.1 AA compliant
- Color contrast ratios meet standards
- Alternative text for visual elements
- Logical tab order

## 🚀 Production Deployment

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Environment Variables

Create `.env.production` for production settings:

```env
VITE_API_BASE_URL=https://api.marksy.app
VITE_APP_VERSION=1.0.0
VITE_ANALYTICS_ID=your-analytics-id
```

### Performance Checklist

- ✅ Lighthouse score > 90
- ✅ First Contentful Paint < 2s
- ✅ Cumulative Layout Shift < 0.1
- ✅ Bundle size optimized
- ✅ Images optimized
- ✅ SEO meta tags configured

## 🐛 Troubleshooting

### Common Issues

1. **Clock not updating**: Check if component is properly mounted
2. **Quotes not changing**: Verify `motivationalQuotes` array is populated
3. **Responsive issues**: Clear browser cache and check viewport meta tag
4. **Dark theme issues**: Ensure ThemeProvider is properly configured

### Debug Mode

Enable debug logging:

```typescript
// Add to HomePage.tsx for debugging
useEffect(() => {
  console.log('HomePage mounted', { stats, latestPaper });
}, []);
```

## 📈 Future Enhancements

### Planned Features
- 📊 Advanced analytics dashboard
- 🔔 Push notifications for events
- 📱 Progressive Web App (PWA) support
- 🌐 Multi-language support
- 🎯 Goal setting and tracking
- 📚 Study planner integration

### Technical Improvements
- ⚡ Service worker for offline support
- 🔄 Real-time sync with backend
- 📊 Advanced charting with D3.js
- 🎨 Theme customization
- 🔍 Advanced search functionality

## 📞 Support & Contact

For questions, issues, or feature requests:

- **Email**: contact@marksy.app
- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)
- **Documentation**: [View full docs](https://docs.marksy.app)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Kaveesha Gimsara**

*Happy studying! 📚✨*
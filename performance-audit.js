// Performance Audit Script
// Run this in browser console to check performance issues

console.log('🚀 Performance Audit Starting...');

// Check for performance issues
const auditPerformance = () => {
  const issues = [];
  
  // 1. Check for universal transitions
  const styles = Array.from(document.styleSheets);
  styles.forEach(sheet => {
    try {
      const rules = Array.from(sheet.cssRules || []);
      rules.forEach(rule => {
        if (rule.selectorText === '*' && rule.style.transition) {
          issues.push('❌ Universal transition found - causes performance issues');
        }
      });
    } catch (e) {
      // Cross-origin stylesheets
    }
  });
  
  // 2. Check for background-attachment: fixed
  const elementsWithFixed = document.querySelectorAll('*');
  elementsWithFixed.forEach(el => {
    const style = getComputedStyle(el);
    if (style.backgroundAttachment === 'fixed') {
      issues.push('❌ background-attachment: fixed found - causes scroll jank');
    }
  });
  
  // 3. Check for too many animations
  const animatedElements = document.querySelectorAll('[style*="animation"], [style*="transition"]');
  if (animatedElements.length > 50) {
    issues.push(`⚠️ Too many animated elements: ${animatedElements.length}`);
  }
  
  // 4. Check image optimization
  const images = document.querySelectorAll('img');
  let unoptimizedImages = 0;
  images.forEach(img => {
    if (!img.loading || img.loading !== 'lazy') {
      unoptimizedImages++;
    }
  });
  if (unoptimizedImages > 0) {
    issues.push(`⚠️ ${unoptimizedImages} images without lazy loading`);
  }
  
  // 5. Check for layout thrashing
  const elementsWithWillChange = document.querySelectorAll('[style*="will-change"]');
  if (elementsWithWillChange.length > 20) {
    issues.push(`⚠️ Too many elements with will-change: ${elementsWithWillChange.length}`);
  }
  
  return issues;
};

// Check Core Web Vitals
const checkWebVitals = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    console.log('📊 Core Web Vitals:');
    console.log(`FCP: ${paint.find(p => p.name === 'first-contentful-paint')?.startTime || 'N/A'}ms`);
    console.log(`LCP: ${navigation?.loadEventEnd || 'N/A'}ms`);
    console.log(`DOM Load: ${navigation?.domContentLoadedEventEnd || 'N/A'}ms`);
  }
};

// Check memory usage
const checkMemory = () => {
  if ('memory' in performance) {
    const memory = performance.memory;
    console.log('💾 Memory Usage:');
    console.log(`Used: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Limit: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
  }
};

// Run audit
const issues = auditPerformance();
checkWebVitals();
checkMemory();

console.log('\n🔍 Performance Issues Found:');
if (issues.length === 0) {
  console.log('✅ No major performance issues detected!');
} else {
  issues.forEach(issue => console.log(issue));
}

console.log('\n💡 Performance Tips:');
console.log('1. Use transform and opacity for animations');
console.log('2. Avoid animating layout properties (width, height, top, left)');
console.log('3. Use will-change sparingly');
console.log('4. Optimize images with proper formats (WebP, AVIF)');
console.log('5. Use lazy loading for below-fold content');
console.log('6. Minimize DOM size and nesting');

// Performance monitoring
const startMonitoring = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  
  const measureFPS = () => {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      console.log(`📈 FPS: ${frameCount}`);
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(measureFPS);
  };
  
  measureFPS();
};

console.log('\n🎯 Starting FPS monitoring...');
startMonitoring();
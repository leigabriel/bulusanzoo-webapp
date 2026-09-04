export default function manifest() {
  return {
    name: 'Bulusan Zoo',
    short_name: 'Bulusan Zoo',
    description: 'Zoo Bulusan visitor and management application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ebebeb',
    theme_color: '#05df72',
    icons: [{ src: '/bz-url-logo.png', sizes: 'any', type: 'image/png' }]
  };
}

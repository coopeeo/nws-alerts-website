// from: https://dev.to/mrwaip/automated-image-compression-a-vite-plugin-using-sharp-3h5d
declare module '*?optimized' {
  const value: {
    webp?: string
    avif?: string
    fallback: string
  }
  export default value
}

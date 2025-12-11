import { ThemeProvider as NextThemesProvider } from "next-themes"

const ThemProvider = ( {children, ...props} ) => {

     return <NextThemesProvider {...props}>{children}</NextThemesProvider>
  
}

export default ThemProvider
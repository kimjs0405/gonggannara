import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface SubVisualProps {
  title: string
  subtitle?: string
  breadcrumb?: { name: string; path?: string }[]
  bgImage?: string
  bgColor?: string
}

const SubVisual = ({ 
  title, 
  subtitle, 
  breadcrumb = [],
  bgImage,
  bgColor = 'from-blue-600 to-blue-800'
}: SubVisualProps) => {
  return (
    <div 
      className="relative h-[120px] md:h-[180px] flex items-center"
      style={bgImage ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      {/* Gradient Background (when no image) */}
      {!bgImage && (
        <div className={`absolute inset-0 bg-gradient-to-r ${bgColor}`} />
      )}
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="relative max-w-[1200px] mx-auto px-4 w-full">
        <div className="text-center md:text-left">
          {/* Breadcrumb */}
          {breadcrumb.length > 0 && (
            <nav className="hidden md:flex items-center gap-1 text-sm text-white/70 mb-2">
              <Link to="/" className="hover:text-white flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span>홈</span>
              </Link>
              {breadcrumb.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5" />
                  {item.path ? (
                    <Link to={item.path} className="hover:text-white">
                      {item.name}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">{item.name}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm md:text-base text-white/80 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubVisual


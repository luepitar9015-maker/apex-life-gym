import React from 'react';
import { 
  Zap, 
  Dumbbell, 
  Flame, 
  Crown, 
  Leaf, 
  Shield, 
  Gem, 
  Target, 
  Star, 
  Trophy 
} from 'lucide-react';
import { SymbolIconKey } from '../styles/themeConfig.js';

interface SymbolIconProps {
  iconKey: SymbolIconKey;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const SymbolIcon: React.FC<SymbolIconProps> = ({
  iconKey,
  size = 20,
  color = 'currentColor',
  style,
  className
}) => {
  const props = { size, color, style, className };

  switch (iconKey) {
    case 'zap':
      return <Zap {...props} />;
    case 'dumbbell':
      return <Dumbbell {...props} />;
    case 'flame':
      return <Flame {...props} />;
    case 'crown':
      return <Crown {...props} />;
    case 'leaf':
      return <Leaf {...props} />;
    case 'shield':
      return <Shield {...props} />;
    case 'gem':
      return <Gem {...props} />;
    case 'target':
      return <Target {...props} />;
    case 'star':
      return <Star {...props} />;
    case 'trophy':
      return <Trophy {...props} />;
    default:
      return <Zap {...props} />;
  }
};

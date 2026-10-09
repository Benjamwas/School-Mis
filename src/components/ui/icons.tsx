import React from "react";
import {
  AwardIcon, BarChart3Icon, BlocksIcon, BookOpenIcon, BriefcaseIcon, Building2Icon,
  CalculatorIcon, CalendarCheckIcon, CalendarDaysIcon, ClipboardListIcon, ClockIcon,
  FileTextIcon, FlameIcon, FlaskConicalIcon, GraduationCapIcon, HandIcon, HandshakeIcon,
  HeartIcon, HomeIcon, ImagesIcon, LanguagesIcon, LayoutDashboardIcon, LifeBuoyIcon,
  ListChecksIcon, MapPinIcon, MenuIcon, MessageSquareIcon, MusicIcon, NewspaperIcon,
  PhoneIcon, PlaneIcon, PlugIcon, QuoteIcon, ReceiptIcon, RocketIcon, SchoolIcon,
  ScrollTextIcon, SendIcon, SettingsIcon, ShieldCheckIcon, SparklesIcon, StarIcon,
  TargetIcon, TrendingUpIcon, TrophyIcon, UserCircleIcon, UserSquare2Icon, UsersIcon,
  UsersRoundIcon, WalletIcon, BoxIcon, MailIcon, GlobeIcon, CompassIcon, CameraIcon,
  DumbbellIcon, UtensilsIcon, WifiIcon, TreePalmIcon, BookMarkedIcon, PaletteIcon
} from "lucide-react";

const MAP: Record<string, React.ComponentType<{
  size?: number;
  className?: string;
}>> = {
  Award: AwardIcon,
  BarChart3: BarChart3Icon,
  Blocks: BlocksIcon,
  BookMarked: BookMarkedIcon,
  BookOpen: BookOpenIcon,
  Briefcase: BriefcaseIcon,
  Building2: Building2Icon,
  Calculator: CalculatorIcon,
  CalendarCheck: CalendarCheckIcon,
  CalendarDays: CalendarDaysIcon,
  Camera: CameraIcon,
  ClipboardList: ClipboardListIcon,
  Clock: ClockIcon,
  Compass: CompassIcon,
  Dumbbell: DumbbellIcon,
  FileText: FileTextIcon,
  Flame: FlameIcon,
  FlaskConical: FlaskConicalIcon,
  Globe: GlobeIcon,
  GraduationCap: GraduationCapIcon,
  Hand: HandIcon,
  Handshake: HandshakeIcon,
  Heart: HeartIcon,
  HelpCircle: BoxIcon,
  Home: HomeIcon,
  Images: ImagesIcon,
  Languages: LanguagesIcon,
  LayoutDashboard: LayoutDashboardIcon,
  LifeBuoy: LifeBuoyIcon,
  ListChecks: ListChecksIcon,
  Mail: MailIcon,
  MapPin: MapPinIcon,
  Menu: MenuIcon,
  MessageSquare: MessageSquareIcon,
  Music: MusicIcon,
  Newspaper: NewspaperIcon,
  Palette: PaletteIcon,
  Phone: PhoneIcon,
  Plane: PlaneIcon,
  Plug: PlugIcon,
  Quote: QuoteIcon,
  Receipt: ReceiptIcon,
  Rocket: RocketIcon,
  School: SchoolIcon,
  ScrollText: ScrollTextIcon,
  Send: SendIcon,
  Settings: SettingsIcon,
  ShieldCheck: ShieldCheckIcon,
  Sparkles: SparklesIcon,
  Star: StarIcon,
  Target: TargetIcon,
  TreePalm: TreePalmIcon,
  TrendingUp: TrendingUpIcon,
  Trophy: TrophyIcon,
  UserCircle: UserCircleIcon,
  UserSquare2: UserSquare2Icon,
  Users: UsersIcon,
  UsersRound: UsersRoundIcon,
  Utensils: UtensilsIcon,
  Wallet: WalletIcon,
  Wifi: WifiIcon
};

export function Icon({
  name,
  size = 18,
  className
}: {name: string;size?: number;className?: string;}) {
  const Cmp = MAP[name] ?? LayoutDashboardIcon;
  return <Cmp size={size} className={className} />;
}

export function SalaMark({
  className = 'h-9 w-9',
  tone = 'forest'
}: {className?: string;tone?: 'forest' | 'white';}) {
  const bg = tone === 'white' ? 'bg-white text-navy' : 'bg-navy text-gold';
  return (
    <span
      className={`grid place-items-center rounded-xl font-heading font-bold tracking-tight ${bg} ${className}`}
      aria-hidden="true"
    >
      SA
    </span>
  );
}

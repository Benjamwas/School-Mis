import React from "react";
import { AwardIcon, BarChart3Icon, BlocksIcon, BookOpenIcon, BriefcaseIcon, Building2Icon, CalculatorIcon, CalendarCheckIcon, CalendarDaysIcon, ClipboardListIcon, ClockIcon, FileTextIcon, FlameIcon, FlaskConicalIcon, GraduationCapIcon, HandIcon, HandshakeIcon, HeartIcon, HomeIcon, ImagesIcon, LanguagesIcon, LayoutDashboardIcon, LifeBuoyIcon, ListChecksIcon, MenuIcon, MessageSquareIcon, NewspaperIcon, PlaneIcon, PlugIcon, ReceiptIcon, SchoolIcon, ScrollTextIcon, SendIcon, SettingsIcon, ShieldCheckIcon, TargetIcon, TrendingUpIcon, TrophyIcon, UserCircleIcon, UserSquare2Icon, UsersIcon, UsersRoundIcon, WalletIcon, BoxIcon } from "lucide-react";
const MAP: Record<string, React.ComponentType<{
  size?: number;
  className?: string;
}>> = {
  Award: AwardIcon,
  BarChart3: BarChart3Icon,
  Blocks: BlocksIcon,
  BookOpen: BookOpenIcon,
  Briefcase: BriefcaseIcon,
  Building2: Building2Icon,
  Calculator: CalculatorIcon,
  CalendarCheck: CalendarCheckIcon,
  CalendarDays: CalendarDaysIcon,
  ClipboardList: ClipboardListIcon,
  Clock: ClockIcon,
  FileText: FileTextIcon,
  Flame: FlameIcon,
  FlaskConical: FlaskConicalIcon,
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
  Menu: MenuIcon,
  MessageSquare: MessageSquareIcon,
  Newspaper: NewspaperIcon,
  Plane: PlaneIcon,
  Plug: PlugIcon,
  Receipt: ReceiptIcon,
  School: SchoolIcon,
  ScrollText: ScrollTextIcon,
  Send: SendIcon,
  Settings: SettingsIcon,
  ShieldCheck: ShieldCheckIcon,
  Target: TargetIcon,
  TrendingUp: TrendingUpIcon,
  Trophy: TrophyIcon,
  UserCircle: UserCircleIcon,
  UserSquare2: UserSquare2Icon,
  Users: UsersIcon,
  UsersRound: UsersRoundIcon,
  Wallet: WalletIcon
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
  const bg = tone === 'white' ? 'bg-white text-forest-800' : 'bg-forest-700 text-white';
  return <span className={`grid place-items-center rounded-lg font-serif font-semibold tracking-tight ${bg} ${className}`} aria-hidden="true">
      SA
    </span>;
}
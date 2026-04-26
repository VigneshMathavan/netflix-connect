// =============================================
//  APP.JSX – Root Router + Global UI
// =============================================
import { AppProvider, useApp } from './store/AppStore';
import AuthScreen    from './components/Auth';
import Navbar        from './components/Navbar';
import HomeScreen    from './components/Home';
import WatchScreen   from './components/Watch';
import PaymentScreen from './components/Payment';
import FriendsScreen from './components/Friends';
import CreatorScreen from './components/Creator';
import DashboardScreen from './components/Dashboard';
import { PaywallModal, CreateRoomModal, JoinRoomModal, InviteModal } from './components/Modals';
import './App.css';

function AppInner() {
  const { state } = useApp();
  const {
    isAuthenticated, view,
    showPaywall, showCreateRoom, showJoinModal, showInviteModal,
    toast,
  } = state;

  if (!isAuthenticated) return <AuthScreen />;

  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        {view === 'home'      && <HomeScreen />}
        {view === 'watch'     && <WatchScreen />}
        {view === 'payment'   && <PaymentScreen />}
        {view === 'friends'   && <FriendsScreen />}
        {view === 'creator'   && <CreatorScreen />}
        {view === 'dashboard' && <DashboardScreen />}
      </main>

      {/* Global Modals */}
      {showPaywall    && <PaywallModal />}
      {showCreateRoom && <CreateRoomModal />}
      {showJoinModal  && <JoinRoomModal />}
      {showInviteModal && <InviteModal />}

      {/* Toast Notifications */}
      {toast && <Toast toast={toast} />}
    </div>
  );
}

function Toast({ toast }) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  return (
    <div className={`toast toast-${toast.type || 'info'}`}>
      <span>{icons[toast.type] || 'ℹ️'}</span>
      <span>{toast.msg}</span>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

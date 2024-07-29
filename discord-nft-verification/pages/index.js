import { useSession } from 'next-auth/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function Home() {
  const { data: session } = useSession();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const linkWallet = async () => {
    if (isConnected) {
      const response = await fetch('/api/link-wallet', {
        method: 'POST',
        body: JSON.stringify({ address }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        alert('Wallet linked successfully');
      }
    }
  };

  return (
    <div>
      <h1>Welcome</h1>
      {!session ? (
        <a href="/api/auth/signin">Login with Discord</a>
      ) : (
        <div>
          <p>Logged in as {session.user.email}</p>
          {!isConnected ? (
            <button onClick={() => connect()}>Connect Wallet</button>
          ) : (
            <div>
              <p>Connected wallet: {address}</p>
              <button onClick={() => linkWallet()}>Link Wallet</button>
              <button onClick={() => disconnect()}>Disconnect Wallet</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

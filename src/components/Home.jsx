import '../styles/Home.css';

export function Home() {
  return (
    <>
      <div className="home">
        <h2>hey dear! welcome to icp-gengen!!</h2>
        <p>
          <strong>icp-gengen</strong> is an AI powered image-to-context DApp
          that leverages {`Google's`} <strong>gemini-1.5-flash</strong> model
          for context generation and the Internet Computer Protocol for Onchain
          storage of assets (generated contents).
        </p>
      </div>
    </>
  );
}

import { Card } from '.';
import '../styles/Mystock.css';

export function MyStock({
  isLoggedIn,
  loading,
  currentUser,
  contexts,
  deleteFunc,
}) {
  console.log({ contexts });
  if (!isLoggedIn) {
    return (
      <>
        <h3>user must login to use this feature</h3>
      </>
    );
  }

  if (!Array.isArray(contexts) || contexts.length < 1) {
    return (
      <>
        <div>
          <h3>user has no contexts generated yet</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mystock">
        {contexts.map((context) => {
          return (
            <>
              <Card
                key={context.id}
                id={context.id}
                loading={loading}
                currentUser={currentUser}
                imageUrl={context.imageUrl}
                text={context.text}
                userId={context.userId}
                deleteFunc={deleteFunc}
              />
            </>
          );
        })}
      </div>
    </>
  );
}

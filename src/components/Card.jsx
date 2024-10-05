import '../styles/Card.css';

export function Card({
  id,
  text,
  imageUrl,
  userId,
  currentUser,
  loading,
  deleteFunc,
}) {
  const canDelete = currentUser === userId;

  return (
    <>
      <div className="card">
        <div className="image">
          <img src={imageUrl} alt="owner" className="img" />
        </div>
        <div className="body">{text}</div>
        <div className="action">
          <button
            className={`${canDelete ? 'show' : 'hide'}`}
            disabled={loading}
            onClick={async () => {
              await deleteFunc({ id, userId });
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </>
  );
}

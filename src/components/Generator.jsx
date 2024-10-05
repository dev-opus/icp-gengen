import '../styles/Generator.css';

export function Generator({
  isLoggedIn,
  image,
  aiResponse,
  genLoading,
  saveLoading,
  showPreview,
  handleImage,
  handleSaveClick,
  handlePreviewClick,
  handleGenerateClick,
}) {
  if (!isLoggedIn) {
    return (
      <>
        <h3>please login in the navbar to use this service</h3>
      </>
    );
  }

  return (
    <>
      <div className="generator">
        <div className="controls">
          <input
            type="file"
            name="image"
            id="file"
            accept="image/*"
            onChange={handleImage}
          />

          <button
            onClick={handleGenerateClick}
            disabled={genLoading || saveLoading}
          >
            {' '}
            {genLoading ? 'generating...' : 'generate context'}
          </button>

          <button disabled={genLoading} onClick={handlePreviewClick}>
            {showPreview ? 'close' : 'preview'}
          </button>
        </div>

        <div className={showPreview ? 'preview' : 'hide'}>
          <div className="body">
            <img src={image} alt="image" width={400} height="auto" />
            <p>{aiResponse}</p>

            <button disabled={saveLoading} onClick={handleSaveClick}>
              {saveLoading ? 'saving...' : 'save'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

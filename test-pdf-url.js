// Test script to check PDF URL accessibility
fetch('http://localhost:5031/uploads/file-1759055459248-422698810.pdf')
  .then(r => {
    console.log('PDF URL Test Results:');
    console.log('Status:', r.status);
    console.log('OK:', r.ok);
    console.log('Content-Type:', r.headers.get('content-type'));
    console.log('Content-Length:', r.headers.get('content-length'));
    
    // Try to get the content as text to see what we're getting
    return r.text();
  })
  .then(text => {
    console.log('First 100 characters of response:', text.substring(0, 100));
  })
  .catch(e => console.log('Error:', e.message));
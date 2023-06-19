let memos = [];

function loadMemos() {    //브라우저 껐다켜도 기록 남게해주는것들
  const storedMemos = localStorage.getItem('memos');
  if (storedMemos) {
    memos = JSON.parse(storedMemos);
    renderMemos();
  }
}

function saveMemos() {    //브라우저 껐다켜도 기록 남게해주는것들
  localStorage.setItem('memos', JSON.stringify(memos));
}

function addMemo() {
  // 제목, 내용, 사진 값 변수에 넣는 과정 
  const titleInput = document.getElementById('memo-title-input'); 
  const contentInput = document.getElementById('memo-content-input');  
  const title = titleInput.value;
  const content = contentInput.value;
  const imageInput = document.getElementById('memo-image-input');
  const imageFile = imageInput.files[0];

  if (title || content || imageFile) {    // 제목, 내용, 사진 중 2개 이상 있으면 출력
    const reader = new FileReader();
    reader.onload = function(event) {
      const imageUrl = event.target.result;
      const currentDate = new Date();                 //시간
      const dateTime = currentDate.toLocaleString();  //추가했을때 시간
      memos.push({ title, content, imageUrl, dateTime }); // 제목, 내용, 사진, 시간
      saveMemos();
      titleInput.value = '';    //저장하고나서 밑에 값 넣고, 다시 공백으로 바꿈.
      contentInput.value = '';  //그래야 계속 push 가능 !
      imageInput.value = '';
      renderMemos();
    };

    if (imageFile) {  //이미지 파일이 있다면
      reader.readAsDataURL(imageFile);  //파일 읽어옴 
    } else {  //이미지 파일이 없다면
      reader.onload = null;
      reader.onloadend = null;
      reader.onerror = null;
      reader.abort();   //파일 읽기 작업을 중단
    }
  }
}


function editMemo(index) {  //제목, 내용 수정
  const memoObj = memos[index];
  const newTitle = prompt('메모 제목을 수정하세요', memoObj.title);
  const newContent = prompt('메모 내용을 수정하세요', memoObj.content);

  if (newTitle || newContent) { //둘중 하나라도 바꿨다면 바꾼값으로 대체 
    memoObj.title = newTitle;
    memoObj.content = newContent;
    saveMemos();
    renderMemos();
  }
}

function editImage(index) { //이미지 수정하기
  const memoObj = memos[index];
  const imageInput = document.createElement('input');
  imageInput.type = 'file';
  imageInput.accept = 'image/*';
  imageInput.onchange = function(event) {
    const imageFile = event.target.files[0];
    if (imageFile) {  //무슨 이미지로 바꿀지 묻고, 바꾼 이미지로 수정하기
      const reader = new FileReader();
      reader.onload = function(event) {
        const imageUrl = event.target.result;
        memoObj.imageUrl = imageUrl;
        saveMemos();
        renderMemos();
        };
        reader.readAsDataURL(imageFile);
        }
        };
        imageInput.click(); //이미지파일 선택할 수 있게 
        }


        function deleteMemo(index) {  //삭제
          memos.splice(index, 1);
          saveMemos();
          renderMemos();
        }

        function deleteImage(index) {   //이미지 삭제
          memos[index].imageUrl = null;
          saveMemos();
          renderMemos();
        }
        
        function searchMemos() {    //찾기 
          const searchInput = document.getElementById('search-input');
          const searchText = searchInput.value.toLowerCase();
          const filteredMemos = memos.filter(
            memo =>   // 제목, 내용중 일치하는게 있으면
              memo.title.toLowerCase().includes(searchText) ||
              memo.content.toLowerCase().includes(searchText)
          );
          renderMemos(filteredMemos);   //찾은 파일 출력
        }
        
        function renderMemos(memosToRender) {
          const memoList = document.getElementById('memo-list');
          memoList.innerHTML = '';  //메모리스트 초기화
        
          const memosToDisplay = memosToRender || memos;
        
          //추가하고 난 후 - 여기서 코드 끝까지가 하나임
          for (let i = 0; i < memosToDisplay.length; i++) { 
            const memoObj = memosToDisplay[i];
            const listItem = document.createElement('li');  //메모 추가되면 li 추가 (한 덩어리)
        
            const titleElement = document.createElement('h2');  //제목 추가
            titleElement.textContent = memoObj.title;
            listItem.appendChild(titleElement);
        
            const contentElement = document.createElement('p'); //내용 추가
            contentElement.textContent = memoObj.content;
            listItem.appendChild(contentElement);
        
            if (memoObj.imageUrl) {
              const imageContainer = document.createElement('div'); //div 추가
              const image = document.createElement('img');  //사진 추가
              image.src = memoObj.imageUrl;
              image.alt = 'Memo Image';
              image.classList.add('memo-image');
              imageContainer.appendChild(image);
        
              const editImageButton = document.createElement('button'); //사진 수정 버튼
              editImageButton.textContent = '사진 수정';
              editImageButton.onclick = function() {
                editImage(i);   //68번째 줄 수정 관련 참고 
              };
              imageContainer.appendChild(editImageButton);
        
              const deleteImageButton = document.createElement('button'); //사진 삭제 버튼
              deleteImageButton.textContent = '사진 삭제';
              deleteImageButton.onclick = function() {
                deleteImage(i);   //49번째 줄 삭제 관련 참고
              };
              imageContainer.appendChild(deleteImageButton);
        
              listItem.appendChild(imageContainer);
            }
        
            const editButton = document.createElement('button');  //제목, 내용 수정 버튼
            editButton.textContent = '수정';
            editButton.onclick = function() {
              editMemo(i);  //55번째 줄 참고
            };
        
            const deleteButton = document.createElement('button');  //글 삭제 버튼
            deleteButton.textContent = '삭제';
            deleteButton.onclick = function() {
              deleteMemo(i);    //90번째 줄 참고 
            };
        
            const dateTimeElement = document.createElement('p');  //시간 추가
            dateTimeElement.textContent = memoObj.dateTime;
            listItem.appendChild(dateTimeElement);
        
            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
        
            memoList.appendChild(listItem);
          }
        }
        
        // 페이지 로드 시 저장된 메모 불러오기
        loadMemos();
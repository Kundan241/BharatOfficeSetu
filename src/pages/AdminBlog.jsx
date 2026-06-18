import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../components/ToastContext';
import { 
  Pencil, ExternalLink, Trash2, ArrowLeft, Plus, 
  Image as ImageIcon, Quote, Code, List as ListIcon, 
  Type, Link as LinkIcon, Bold, Italic, Check, X
} from 'lucide-react';
import { db, storage } from '../firebase';
import { 
  collection, doc, getDocs, setDoc, addDoc, updateDoc, 
  deleteDoc, query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { uploadFile } from '../services/cloudinary';

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60);
};

const calculateReadTime = (content) => {
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

export default function AdminBlog({ showConfirm }) {
  const { addToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  
  // Editor State
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [authorName, setAuthorName] = useState('Bharat Office Setu');
  const [autoReadTime, setAutoReadTime] = useState(true);
  const [manualReadTime, setManualReadTime] = useState(5);
  
  const [activeTab, setActiveTab] = useState('edit');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved'
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const presetTags = [
    'GST', 'Virtual Office', 'Company Setup', 'Compliance',
    'Trademark', 'E-Commerce', 'Expansion', 'Startup', 'LLP', 'Pvt Ltd'
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(fetched);
    } catch (e) {
      console.error(e);
      addToast('error', 'Failed to load posts');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (isEditing && title.trim()) {
      setSaveStatus('unsaved');
      const timer = setTimeout(() => {
        if (!published) {
          savePost(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [title, brief, content, coverImageUrl, featured, selectedTags, authorName, autoReadTime, manualReadTime]);

  const openEditor = (post = null) => {
    if (post) {
      setCurrentPost(post);
      setTitle(post.title || '');
      setBrief(post.brief || '');
      setContent(post.content || '');
      setCoverImageUrl(post.coverImageUrl || '');
      setPublished(post.published || false);
      setFeatured(post.featured || false);
      setSelectedTags(post.tags || []);
      setAuthorName(post.author || 'Bharat Office Setu');
      setAutoReadTime(true); // Default to auto
      setManualReadTime(post.readTime || 5);
    } else {
      setCurrentPost(null);
      setTitle('');
      setBrief('');
      setContent('');
      setCoverImageUrl('');
      setPublished(false);
      setFeatured(false);
      setSelectedTags([]);
      setAuthorName('Bharat Office Setu');
      setAutoReadTime(true);
      setManualReadTime(5);
    }
    setSaveStatus('saved');
    setActiveTab('edit');
    setIsEditing(true);
  };

  const closeEditor = () => {
    if (saveStatus === 'unsaved') {
      showConfirm({
        title: 'Unsaved changes?',
        message: 'You have unsaved changes. Are you sure you want to leave?',
        confirmText: 'Leave',
        type: 'warning',
        onConfirm: () => setIsEditing(false)
      });
    } else {
      setIsEditing(false);
    }
    fetchPosts();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const url = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });
      setCoverImageUrl(url);
      setUploadProgress(null);
    } catch (error) {
      console.error(error);
      addToast('error', 'Image upload failed');
      setUploadProgress(null);
    }
  };

  const insertHtml = (tag) => {
    const textarea = document.getElementById('content-editor');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let inserted = '';

    if (tag === 'H2') inserted = `<h2>${selectedText}</h2>`;
    else if (tag === 'H3') inserted = `<h3>${selectedText}</h3>`;
    else if (tag === 'B') inserted = `<strong>${selectedText}</strong>`;
    else if (tag === 'I') inserted = `<em>${selectedText}</em>`;
    else if (tag === 'Link') {
      const url = prompt('Enter URL:');
      if (url) inserted = `<a href="${url}">${selectedText || 'Link text'}</a>`;
      else return;
    }
    else if (tag === 'UL') inserted = `<ul>\n  <li>${selectedText}</li>\n</ul>`;
    else if (tag === 'OL') inserted = `<ol>\n  <li>${selectedText}</li>\n</ol>`;
    else if (tag === 'Quote') inserted = `<blockquote>${selectedText}</blockquote>`;
    else if (tag === 'Code') inserted = `<code>${selectedText}</code>`;
    else if (tag === 'Image') {
      const url = prompt('Enter Image URL:');
      if (url) inserted = `<img src="${url}" alt="Image" />`;
      else return;
    }

    const newContent = content.substring(0, start) + inserted + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + inserted.length, start + inserted.length);
    }, 0);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleCustomTagKeyDown = (e) => {
    if (e.key === 'Enter' && customTag.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(customTag.trim())) {
        setSelectedTags([...selectedTags, customTag.trim()]);
      }
      setCustomTag('');
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const savePost = async (isAutoSave = false, publishAction = false) => {
    if (!title.trim()) {
      if (!isAutoSave) addToast('error', 'Title is required');
      return;
    }

    if (!isAutoSave) setSaveStatus('saving');

    const slug = generateSlug(title);
    const postData = {
      title: title.trim(),
      slug: slug,
      brief: brief.trim(),
      content: content,
      coverImageUrl: coverImageUrl || '',
      published: publishAction ? true : published,
      featured: featured,
      tags: selectedTags,
      author: authorName || 'Bharat Office Setu',
      readTime: autoReadTime ? calculateReadTime(content) : manualReadTime,
      updatedAt: serverTimestamp(),
    };

    try {
      if (publishAction && !currentPost?.publishedAt) {
        postData.publishedAt = serverTimestamp();
      }

      if (currentPost?.id) {
        await updateDoc(doc(db, 'blog_posts', currentPost.id), postData);
      } else {
        postData.createdAt = serverTimestamp();
        const docRef = await addDoc(collection(db, 'blog_posts'), postData);
        setCurrentPost({ id: docRef.id, ...postData });
      }

      setSaveStatus('saved');
      if (publishAction) {
        setPublished(true);
        addToast('success', 'Post published! ✓');
      } else if (!isAutoSave) {
        addToast('success', 'Draft saved ✓');
      }
    } catch (e) {
      console.error(e);
      if (!isAutoSave) addToast('error', 'Failed to save post');
      setSaveStatus('unsaved');
    }
  };

  const deletePost = async (id) => {
    showConfirm({
      title: 'Delete this post permanently?',
      message: 'This cannot be undone.',
      confirmText: 'Delete Post',
      type: 'danger',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'blog_posts', id));
          addToast('success', 'Post deleted');
          if (isEditing) {
            setIsEditing(false);
          }
          fetchPosts();
        } catch (e) {
          addToast('error', 'Failed to delete post');
        }
      }
    });
  };

  if (!isEditing) {
    return (
      <div className="fade-up-enter max-w-[1000px] mx-auto pb-20">
        <div className="mb-7 flex justify-between items-start">
          <div>
            <h1 className="text-[20px] font-[800] text-[#111110]">Blog Posts</h1>
            <p className="text-[13px] text-[rgba(17,17,16,0.45)] mt-1">Manage your weekly articles</p>
          </div>
          <button 
            onClick={() => openEditor()}
            className="bg-[#1B6B2F] text-white h-[40px] rounded-[100px] px-[20px] text-[13px] font-[600] hover:bg-[#145324] transition-colors"
          >
            + Write New Post
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-[#1B6B2F]/20 border-t-[#1B6B2F] rounded-full animate-spin"></div></div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[80px] text-center">
            <Pencil size={40} color="rgba(17,17,16,0.15)" className="mb-4" />
            <div className="text-[15px] text-[rgba(17,17,16,0.4)] font-[500]">No blog posts yet</div>
            <div className="text-[13px] text-[rgba(17,17,16,0.3)] mt-1">Click Write New Post to get started</div>
          </div>
        ) : (
          <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] overflow-hidden mt-5">
            <div className="bg-[#F9F8F5] px-[20px] py-[12px] text-[11px] font-[600] tracking-[0.08em] text-[rgba(17,17,16,0.4)] grid grid-cols-[45%_20%_15%_10%_10%]">
              <div>POST</div>
              <div>TAGS</div>
              <div>STATUS</div>
              <div>DATE</div>
              <div>ACTIONS</div>
            </div>
            {posts.map(post => (
              <div key={post.id} className="px-[20px] py-[14px] border-t border-[rgba(17,17,16,0.05)] grid grid-cols-[45%_20%_15%_10%_10%] items-center hover:bg-[rgba(27,107,47,0.02)] transition-colors">
                <div className="flex items-center gap-3 pr-4">
                  <img src={post.coverImageUrl || ''} alt="" className="w-[56px] h-[40px] rounded-[6px] object-cover bg-[#F4F3EE] shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-[14px] font-[600] text-[#111110] truncate">{post.title || 'Untitled'}</div>
                    <div className="text-[12px] text-[rgba(17,17,16,0.4)] truncate">{post.brief || 'No brief'}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 pr-4">
                  {(post.tags || []).slice(0, 2).map(tag => (
                    <span key={tag} className="bg-[rgba(27,107,47,0.08)] text-[#1B6B2F] rounded-[100px] px-2 py-[2px] text-[11px] font-[600]">{tag}</span>
                  ))}
                  {(post.tags?.length > 2) && (
                    <span className="bg-[rgba(27,107,47,0.08)] text-[#1B6B2F] rounded-[100px] px-2 py-[2px] text-[11px] font-[600]">+{post.tags.length - 2}</span>
                  )}
                </div>
                <div className="flex items-center pr-4">
                  {post.featured && <span className="text-[#F4831F] text-[12px] mr-1.5">★</span>}
                  {post.published ? (
                    <span className="bg-[rgba(27,107,47,0.1)] text-[#1B6B2F] rounded-[100px] px-[10px] py-[3px] text-[11px] font-[600]">Published</span>
                  ) : (
                    <span className="bg-[rgba(17,17,16,0.06)] text-[rgba(17,17,16,0.45)] rounded-[100px] px-[10px] py-[3px] text-[11px] font-[600]">Draft</span>
                  )}
                </div>
                <div className="text-[12px] text-[rgba(17,17,16,0.35)]">
                  {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEditor(post)} className="text-[rgba(17,17,16,0.4)] hover:text-[#1B6B2F]"><Pencil size={16} /></button>
                  {post.published && <button onClick={() => window.open('/blog/' + post.slug, '_blank')} className="text-[rgba(17,17,16,0.4)] hover:text-[#1B6B2F]"><ExternalLink size={16} /></button>}
                  <button onClick={() => deletePost(post.id)} className="text-[rgba(17,17,16,0.25)] hover:text-[#DC2626]"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- EDITOR VIEW ---
  return (
    <div className="fade-up-enter pb-20 w-full">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-[24px] pb-[16px] border-b border-[rgba(17,17,16,0.08)]">
        <button onClick={closeEditor} className="text-[rgba(17,17,16,0.45)] text-[13px] hover:text-[#111110] flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Posts
        </button>
        <div className="text-[12px] text-[rgba(17,17,16,0.4)] flex items-center gap-1.5">
          {saveStatus === 'saved' && <><span className="w-1.5 h-1.5 rounded-full bg-[#1B6B2F]"></span> All changes saved</>}
          {saveStatus === 'saving' && <><div className="w-3 h-3 border-2 border-[rgba(17,17,16,0.2)] border-t-[rgba(17,17,16,0.6)] rounded-full animate-spin"></div> Saving...</>}
          {saveStatus === 'unsaved' && <><span className="w-1.5 h-1.5 rounded-full bg-[rgba(17,17,16,0.3)]"></span> Unsaved changes</>}
        </div>
        <div className="flex items-center">
          <button onClick={() => savePost(false, false)} className="border border-[rgba(17,17,16,0.12)] text-[rgba(17,17,16,0.55)] h-[36px] rounded-[100px] px-[18px] text-[13px] font-[600] hover:bg-[#F9F8F5]">
            Save Draft
          </button>
          <button onClick={() => savePost(false, true)} className="bg-[#1B6B2F] text-white h-[36px] rounded-[100px] px-[18px] text-[13px] font-[600] ml-[8px] hover:bg-[#145324]">
            {published ? 'Update →' : 'Publish →'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-[24px] items-start">
        {/* LEFT COLUMN - EDITOR */}
        <div>
          {/* Cover Image Upload */}
          <div 
            className="w-full md:h-[220px] h-[160px] rounded-[14px] overflow-hidden relative mb-[24px] cursor-pointer"
            onClick={() => !coverImageUrl && fileInputRef.current?.click()}
          >
            {coverImageUrl ? (
              <div className="relative w-full h-full group">
                <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[14px] font-[500]" onClick={() => fileInputRef.current?.click()}>
                  Change image
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCoverImageUrl(''); }}
                  className="absolute top-3 right-3 w-[28px] h-[28px] bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-full h-full bg-[#F4F3EE] border-2 border-dashed border-[rgba(17,17,16,0.15)] hover:border-[rgba(27,107,47,0.3)] hover:bg-[rgba(27,107,47,0.02)] transition-colors flex flex-col items-center justify-center gap-[10px]">
                <ImageIcon size={32} color="rgba(17,17,16,0.2)" />
                <div className="text-[14px] text-[rgba(17,17,16,0.45)]">Click to upload cover image</div>
                <div className="text-[12px] text-[rgba(17,17,16,0.3)]">Recommended: 1200×630px, JPG or PNG</div>
              </div>
            )}
            
            {uploadProgress !== null && (
              <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center">
                <div className="text-[14px] font-[500] text-[#111110] mb-3">Uploading... {Math.round(uploadProgress)}%</div>
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[rgba(27,107,47,0.2)]">
                  <div className="h-full bg-[#1B6B2F] transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} />
          
          <input 
            type="text" 
            placeholder="Or paste an image URL..." 
            value={coverImageUrl} 
            onChange={e => setCoverImageUrl(e.target.value)} 
            className="w-full h-[36px] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-[12px] text-[12px] outline-none focus:border-[rgba(27,107,47,0.4)] mb-[24px] bg-white"
          />

          <textarea
            ref={textareaRef}
            placeholder="Post title..."
            value={title}
            onChange={handleTitleChange}
            className="w-full text-[32px] font-[800] text-[#111110] border-none border-b-2 border-[rgba(17,17,16,0.08)] bg-transparent resize-none leading-[1.2] pb-[16px] mb-[8px] focus:outline-none focus:border-b-[#1B6B2F] transition-colors"
            rows={1}
          />
          <div className="text-[12px] text-[rgba(17,17,16,0.35)] font-mono mb-[20px]">
            bharatofficesetu.com/blog/{generateSlug(title)}
          </div>

          <div className="flex justify-between items-end mb-[8px]">
            <div className="text-[12px] font-[600] text-[rgba(17,17,16,0.4)]">Article excerpt</div>
            <div className="text-[12px] text-[rgba(17,17,16,0.35)]">{brief.length}/160</div>
          </div>
          <textarea
            rows={3}
            maxLength={160}
            placeholder="Short description shown in search results and article listings. Keep it under 160 characters."
            value={brief}
            onChange={e => setBrief(e.target.value)}
            className="w-full bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[10px] p-[12px_14px] text-[14px] text-[rgba(17,17,16,0.75)] outline-none focus:border-[rgba(27,107,47,0.4)] focus:bg-white resize-none leading-[1.6] mb-[24px]"
          />

          <div className="flex justify-between items-end mb-[8px]">
            <div className="text-[12px] font-[600] text-[rgba(17,17,16,0.4)]">Article content</div>
            <div className="flex gap-1 bg-[#F9F8F5] p-1 rounded-[10px] border border-[rgba(17,17,16,0.08)]">
              <button onClick={() => setActiveTab('edit')} className={`h-[32px] px-[14px] rounded-[8px] text-[12px] font-[600] transition-colors ${activeTab === 'edit' ? 'bg-[#111110] text-white' : 'text-[rgba(17,17,16,0.5)] hover:text-[#111110]'}`}>Edit</button>
              <button onClick={() => setActiveTab('preview')} className={`h-[32px] px-[14px] rounded-[8px] text-[12px] font-[600] transition-colors ${activeTab === 'preview' ? 'bg-[#111110] text-white' : 'text-[rgba(17,17,16,0.5)] hover:text-[#111110]'}`}>Preview</button>
            </div>
          </div>

          {activeTab === 'edit' ? (
            <div className="rounded-[10px] border border-[rgba(17,17,16,0.1)] overflow-hidden">
              <div className="bg-[#F9F8F5] border-b border-[rgba(17,17,16,0.1)] p-[8px_12px] flex gap-[4px] flex-wrap items-center overflow-x-auto">
                <button onClick={() => insertHtml('H2')} className="h-[30px] min-w-[30px] px-2 rounded-[6px] text-[12px] font-[600] text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.06)] active:bg-[rgba(27,107,47,0.1)] active:text-[#1B6B2F]">H2</button>
                <button onClick={() => insertHtml('H3')} className="h-[30px] min-w-[30px] px-2 rounded-[6px] text-[12px] font-[600] text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.06)] active:bg-[rgba(27,107,47,0.1)] active:text-[#1B6B2F]">H3</button>
                <div className="w-[1px] h-[20px] bg-[rgba(17,17,16,0.1)] mx-1"></div>
                <button onClick={() => insertHtml('B')} className="h-[30px] min-w-[30px] px-2 rounded-[6px] text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.06)] flex justify-center items-center"><Bold size={14} /></button>
                <button onClick={() => insertHtml('I')} className="h-[30px] min-w-[30px] px-2 rounded-[6px] text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.06)] flex justify-center items-center"><Italic size={14} /></button>
                <div className="w-[1px] h-[20px] bg-[rgba(17,17,16,0.1)] mx-1"></div>
                <button onClick={() => insertHtml('Link')} className="h-[30px] min-w-[30px] px-2 rounded-[6px] text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.06)] flex justify-center items-center"><LinkIcon size={14} /></button>
                <button onClick={() => insertHtml('UL')} className="h-[30px] min-w-[30px] px-2 rounded-[6px] text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.06)] flex justify-center items-center"><ListIcon size={14} /></button>
                <button onClick={() => insertHtml('OL')} className="h-[30px] min-w-[30px] px-2 rounded-[6px] text-[12px] font-[600] text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.06)] active:bg-[rgba(27,107,47,0.1)] active:text-[#1B6B2F]">1.</button>
                <div className="w-[1px] h-[20px] bg-[rgba(17,17,16,0.1)] mx-1"></div>
                <button onClick={() => insertHtml('Quote')} className="h-[30px] min-w-[30px] px-2 rounded-[6px] text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.06)] flex justify-center items-center"><Quote size={14} /></button>
                <button onClick={() => insertHtml('Code')} className="h-[30px] min-w-[30px] px-2 rounded-[6px] text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.06)] flex justify-center items-center"><Code size={14} /></button>
                <div className="w-[1px] h-[20px] bg-[rgba(17,17,16,0.1)] mx-1"></div>
                <button onClick={() => insertHtml('Image')} className="h-[30px] min-w-[30px] px-2 rounded-[6px] text-[rgba(17,17,16,0.6)] hover:bg-[rgba(17,17,16,0.06)] flex items-center gap-1.5"><ImageIcon size={14} /><span className="text-[12px] font-[600]">Image</span></button>
              </div>
              <textarea
                id="content-editor"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full min-h-[400px] bg-white p-[20px] font-mono text-[14px] leading-[1.8] text-[#111110] outline-none resize-y"
                placeholder="Write your article here using HTML...&#10;&#10;Examples:&#10;<h2>Section heading</h2>&#10;<p>Paragraph text goes here.</p>&#10;<ul>&#10;  <li>Bullet point one</li>&#10;</ul>"
              />
            </div>
          ) : (
            <div 
              className="rounded-[10px] border border-[rgba(17,17,16,0.1)] bg-white p-[20px_32px] min-h-[400px] overflow-y-auto article-preview"
              dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">Nothing to preview...</p>' }}
            />
          )}

          <style>{`
            .article-preview h2 { font-size: 22px; font-weight: 700; color: #111110; border-bottom: 1px solid rgba(17,17,16,0.08); padding-bottom: 8px; margin: 28px 0 12px; }
            .article-preview h3 { font-size: 18px; font-weight: 700; margin: 20px 0 8px; }
            .article-preview p { font-size: 16px; line-height: 1.8; color: rgba(17,17,16,0.8); margin-bottom: 16px; }
            .article-preview ul, .article-preview ol { padding-left: 24px; margin-bottom: 16px; list-style-type: disc; }
            .article-preview ol { list-style-type: decimal; }
            .article-preview li { font-size: 16px; line-height: 1.8; margin-bottom: 6px; }
            .article-preview blockquote { border-left: 3px solid #F4831F; background: rgba(244,131,31,0.04); padding: 12px 18px; border-radius: 0 8px 8px 0; margin: 20px 0; }
            .article-preview strong { font-weight: 700; color: #111110; }
            .article-preview code { background: rgba(17,17,16,0.06); border-radius: 4px; padding: 2px 6px; font-family: monospace; font-size: 13px; }
            .article-preview img { width: 100%; border-radius: 10px; margin: 16px 0; }
            .article-preview a { color: #1B6B2F; text-decoration: underline; }
          `}</style>
        </div>

        {/* RIGHT COLUMN - SETTINGS */}
        <div className="md:sticky md:top-[32px] flex flex-col gap-[12px]">
          
          <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] p-[16px_20px]">
            <div className="text-[13px] font-[700] text-[#111110] mb-[14px]">Publish Settings</div>
            
            <div className="flex justify-between items-center mb-[12px]">
              <div className="text-[13px] text-[#111110]">Status</div>
              <div 
                onClick={() => setPublished(!published)}
                className={`w-[80px] h-[28px] rounded-[100px] flex items-center px-[4px] cursor-pointer transition-colors ${published ? 'bg-[#1B6B2F]' : 'bg-[rgba(17,17,16,0.1)]'}`}
              >
                <div className={`w-[20px] h-[20px] bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform ${published ? 'translate-x-[52px]' : 'translate-x-0'}`}></div>
                <div className={`absolute text-[10px] font-[600] pointer-events-none ${published ? 'ml-[10px] text-white' : 'ml-[32px] text-[rgba(17,17,16,0.5)]'}`}>
                  {published ? 'Published' : 'Draft'}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-[12px]">
              <div>
                <div className="text-[13px] text-[#111110]">Featured post</div>
                <div className="text-[11px] text-[rgba(17,17,16,0.35)]">Shows prominently on blog listing</div>
              </div>
              <div 
                onClick={() => setFeatured(!featured)}
                className={`w-[44px] h-[24px] rounded-[100px] flex items-center px-[3px] cursor-pointer transition-colors ${featured ? 'bg-[#1B6B2F]' : 'bg-[rgba(17,17,16,0.1)]'}`}
              >
                <div className={`w-[18px] h-[18px] bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform ${featured ? 'translate-x-[20px]' : 'translate-x-0'}`}></div>
              </div>
            </div>

            {published && currentPost?.publishedAt && (
              <div className="text-[12px] text-[rgba(17,17,16,0.4)] mt-[14px] pt-[14px] border-t border-[rgba(17,17,16,0.08)]">
                Published: {new Date(currentPost.publishedAt.seconds * 1000).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] p-[16px_20px]">
            <div className="text-[13px] font-[700] text-[#111110] mb-[12px]">Tags</div>
            <div className="flex flex-wrap gap-[6px] mb-[12px]">
              {presetTags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-[11px] rounded-[100px] px-[10px] py-[3px] transition-colors ${selectedTags.includes(tag) ? 'bg-[rgba(27,107,47,0.1)] border border-[rgba(27,107,47,0.25)] text-[#1B6B2F] font-[600]' : 'bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] text-[rgba(17,17,16,0.55)]'}`}
                >
                  {tag} {selectedTags.includes(tag) && '×'}
                </button>
              ))}
            </div>
            
            <input 
              type="text" 
              placeholder="Add custom tag..."
              value={customTag}
              onChange={e => setCustomTag(e.target.value)}
              onKeyDown={handleCustomTagKeyDown}
              className="w-full h-[36px] text-[13px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-[12px] outline-none focus:border-[rgba(27,107,47,0.4)]"
            />

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-[6px] mt-[8px]">
                {selectedTags.map(tag => (
                  <span key={tag} className="bg-[rgba(27,107,47,0.08)] text-[#1B6B2F] rounded-[100px] p-[3px_8px_3px_10px] text-[12px] font-[600] inline-flex items-center gap-[6px]">
                    {tag}
                    <button onClick={() => toggleTag(tag)} className="text-[14px] text-[rgba(27,107,47,0.5)] leading-none hover:text-[#1B6B2F]">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] p-[16px_20px]">
            <div className="text-[13px] font-[700] text-[#111110] mb-[14px]">Author & Meta</div>
            
            <div className="mb-[12px]">
              <div className="text-[11px] font-[600] text-[rgba(17,17,16,0.4)] mb-[4px]">Author name</div>
              <input 
                type="text" 
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="w-full h-[40px] text-[13px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-[12px] outline-none focus:border-[rgba(27,107,47,0.4)]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-[4px]">
                <div className="text-[11px] font-[600] text-[rgba(17,17,16,0.4)]">Read time</div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[rgba(17,17,16,0.4)]">Auto</span>
                  <div 
                    onClick={() => setAutoReadTime(!autoReadTime)}
                    className={`w-[36px] h-[20px] rounded-[100px] flex items-center px-[3px] cursor-pointer transition-colors ${autoReadTime ? 'bg-[#1B6B2F]' : 'bg-[rgba(17,17,16,0.1)]'}`}
                  >
                    <div className={`w-[14px] h-[14px] bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform ${autoReadTime ? 'translate-x-[16px]' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="number"
                  min="1" max="60"
                  value={autoReadTime ? calculateReadTime(content) : manualReadTime}
                  onChange={e => !autoReadTime && setManualReadTime(parseInt(e.target.value) || 1)}
                  disabled={autoReadTime}
                  className="w-full h-[40px] text-[13px] bg-[#F9F8F5] border border-[rgba(17,17,16,0.1)] rounded-[8px] px-[12px] pr-[60px] outline-none focus:border-[rgba(27,107,47,0.4)] disabled:opacity-60"
                />
                <div className="absolute right-[12px] top-[10px] text-[13px] text-[rgba(17,17,16,0.4)] pointer-events-none">min read</div>
              </div>
            </div>
          </div>

          {currentPost && (
            <div className="bg-white rounded-[14px] border border-[rgba(17,17,16,0.08)] p-[16px_20px]">
              <div className="text-[13px] font-[700] text-[#DC2626] mb-[12px]">Danger Zone</div>
              <button 
                onClick={() => deletePost(currentPost.id)}
                className="w-full h-[36px] bg-transparent border border-[rgba(220,38,38,0.3)] text-[#DC2626] rounded-[100px] text-[13px] font-[600] hover:bg-[rgba(220,38,38,0.04)] hover:border-[rgba(220,38,38,0.5)] transition-colors"
              >
                Delete this post
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

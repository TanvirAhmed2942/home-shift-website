import React, { useState } from 'react';
import { 
  Globe, FileText, Image as ImageIcon, Settings, Save, Eye, Edit, Trash2, 
  Plus, Upload, Search, Check, X, LayoutTemplate, Link as LinkIcon, Download 
} from 'lucide-react';
import { unsplash_tool } from '../../utils/unsplash_tool'; // Hypothetical tool import if we were using it directly, but we'll mock the integration here

// --- TYPES ---
interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/svg+xml';
  size: number; // KB
  dimensions?: string;
  uploadedAt: string;
  category: 'general' | 'hero' | 'services' | 'logos' | 'testimonials';
}

interface ContentSection {
  id: string;
  name: string;
  type: 'text' | 'image' | 'textarea' | 'html';
  content: string; // Text content or Image URL
  category: string;
  page: 'home' | 'services' | 'about' | 'contact' | 'global';
  helperText?: string;
}

// --- MOCK DATA ---
const MOCK_MEDIA: MediaItem[] = [
  { id: 'm1', url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80', name: 'hero-main.jpg', type: 'image/jpeg', size: 450, dimensions: '1920x1080', uploadedAt: '2023-12-01', category: 'hero' },
  { id: 'm2', url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80', name: 'service-moving.jpg', type: 'image/jpeg', size: 320, dimensions: '800x600', uploadedAt: '2023-12-05', category: 'services' },
  { id: 'm3', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80', name: 'team-meeting.jpg', type: 'image/jpeg', size: 280, dimensions: '1200x800', uploadedAt: '2023-12-10', category: 'general' },
  { id: 'm4', url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80', name: 'happy-customer.jpg', type: 'image/jpeg', size: 150, dimensions: '600x600', uploadedAt: '2023-12-12', category: 'testimonials' },
];

const DEFAULT_CONTENT: ContentSection[] = [
  // HOME PAGE
  { id: 'home-hero-title', page: 'home', category: 'Hero Section', name: 'Main Title', type: 'text', content: 'Move with confidence', helperText: 'H1 Heading on the homepage' },
  { id: 'home-hero-sub', page: 'home', category: 'Hero Section', name: 'Subtitle', type: 'textarea', content: 'Professional moving & logistics services across the UK.', helperText: 'Text below the main title' },
  { id: 'home-hero-img', page: 'home', category: 'Hero Section', name: 'Background Image', type: 'image', content: MOCK_MEDIA[0].url, helperText: '1920x1080px recommended' },
  
  // SERVICES PAGE
  { id: 'serv-house-title', page: 'services', category: 'House Removals', name: 'Card Title', type: 'text', content: 'House Moves', helperText: 'Title of the first service card' },
  { id: 'serv-house-img', page: 'services', category: 'House Removals', name: 'Card Image', type: 'image', content: MOCK_MEDIA[1].url, helperText: '800x600px recommended' },
  
  // GLOBAL
  { id: 'global-logo', page: 'global', category: 'Branding', name: 'Site Logo', type: 'image', content: '', helperText: 'Transparent PNG recommended' },
  { id: 'global-footer', page: 'global', category: 'Footer', name: 'Footer Text', type: 'textarea', content: '© 2024 ShiftMyHome. All rights reserved.', helperText: '' },
];

// --- COMPONENTS ---

// 1. MEDIA LIBRARY COMPONENT
const MediaLibrary = ({ 
  onSelect, 
  selectable = false 
}: { 
  onSelect?: (url: string) => void, 
  selectable?: boolean 
}) => {
  const [media, setMedia] = useState<MediaItem[]>(MOCK_MEDIA);
  const [filter, setFilter] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleUploadMock = () => {
    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newMedia: MediaItem = {
        id: `m-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80', // Placeholder result
        name: `upload-${Date.now()}.jpg`,
        type: 'image/jpeg',
        size: 250,
        uploadedAt: new Date().toISOString().split('T')[0],
        category: 'general'
      };
      setMedia([newMedia, ...media]);
      setUploading(false);
    }, 1500);
  };

  const handleAddUrl = () => {
    if (!urlInput) return;
    const newMedia: MediaItem = {
      id: `m-${Date.now()}`,
      url: urlInput,
      name: 'external-image.jpg',
      type: 'image/jpeg',
      size: 0,
      uploadedAt: new Date().toISOString().split('T')[0],
      category: 'general'
    };
    setMedia([newMedia, ...media]);
    setUrlInput('');
  };

  const filteredMedia = filter === 'all' ? media : media.filter(m => m.category === filter);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['all', 'hero', 'services', 'logos', 'general'].map(cat => (
             <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${
                filter === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg px-2">
            <LinkIcon className="w-4 h-4 text-slate-400" />
            <input 
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="Add by URL..."
              className="bg-transparent border-none text-sm px-2 py-1.5 focus:ring-0 w-40"
            />
            <button onClick={handleAddUrl} className="text-xs font-bold text-blue-600 hover:text-blue-700">ADD</button>
          </div>
          <button 
            onClick={handleUploadMock}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
          >
            {uploading ? 'Uploading...' : (
              <>
                <Upload className="w-4 h-4" />
                Upload New
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map(item => (
            <div 
              key={item.id} 
              className="group relative bg-slate-50 rounded-lg border border-slate-200 aspect-square flex flex-col overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => selectable && onSelect && onSelect(item.url)}
            >
              <div className="flex-1 relative overflow-hidden bg-slate-200">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                {selectable && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                      SELECT
                    </div>
                  </div>
                )}
              </div>
              <div className="p-2 bg-white border-t border-slate-100">
                <p className="text-xs font-medium text-slate-700 truncate">{item.name}</p>
                <p className="text-[10px] text-slate-400">{item.dimensions || 'Unknown'} • {item.size > 0 ? `${item.size} KB` : 'Link'}</p>
              </div>
              
              {!selectable && (
                <button className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. MAIN MANAGER
export function WebsiteContentManager() {
  const [activeTab, setActiveTab] = useState<'content' | 'media'>('content');
  const [activePage, setActivePage] = useState<'home' | 'services' | 'about' | 'contact' | 'global'>('home');
  const [sections, setSections] = useState<ContentSection[]>(DEFAULT_CONTENT);
  const [editingImageId, setEditingImageId] = useState<string | null>(null); // If set, media picker is open
  const [hasChanges, setHasChanges] = useState(false);

  const handleContentChange = (id: string, newVal: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content: newVal } : s));
    setHasChanges(true);
  };

  const handleImageSelect = (url: string) => {
    if (editingImageId) {
      handleContentChange(editingImageId, url);
      setEditingImageId(null);
    }
  };

  const handleSave = () => {
    // Mock save
    setHasChanges(false);
    // Trigger toast
    alert("Changes published to live website!");
  };

  const pageSections = sections.filter(s => s.page === activePage);

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">CMS & Website</h2>
          <p className="text-slate-600 mt-1">Manage content, images, and pages</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors">
            View Live Site
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all shadow-lg ${
              hasChanges 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            {hasChanges ? 'Publish Changes' : 'Published'}
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 shrink-0">
        <button 
          onClick={() => setActiveTab('content')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'content' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          Page Content
        </button>
        <button 
          onClick={() => setActiveTab('media')}
          className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'media' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Media Library
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 bg-slate-50/50 rounded-xl border border-slate-200 overflow-hidden flex">
        
        {activeTab === 'media' ? (
          <div className="w-full h-full">
            <MediaLibrary />
          </div>
        ) : (
          <>
            {/* Sidebar Pages */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
              <div className="p-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pages</span>
              </div>
              <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {[
                  { id: 'home', label: 'Home Page' },
                  { id: 'services', label: 'Services' },
                  { id: 'about', label: 'About Us' },
                  { id: 'contact', label: 'Contact' },
                  { id: 'global', label: 'Global (Header/Footer)' },
                ].map(page => (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activePage === page.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-bold text-slate-900 capitalize">{activePage} Page Editing</h3>
                </div>

                {pageSections.map(section => (
                  <div key={section.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        {section.name}
                        {section.helperText && (
                          <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {section.helperText}
                          </span>
                        )}
                      </label>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{section.category}</span>
                      </div>
                    </div>

                    {section.type === 'text' && (
                      <input 
                        type="text"
                        value={section.content}
                        onChange={e => handleContentChange(section.id, e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    )}

                    {section.type === 'textarea' && (
                      <textarea 
                        value={section.content}
                        onChange={e => handleContentChange(section.id, e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    )}

                    {section.type === 'image' && (
                      <div className="flex items-start gap-4">
                        <div className="w-32 h-20 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative group/img">
                           {section.content ? (
                             <img src={section.content} alt="Preview" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-400">
                               <ImageIcon className="w-6 h-6" />
                             </div>
                           )}
                        </div>
                        <div className="flex-1">
                          <div className="flex gap-2">
                             <input 
                                value={section.content}
                                readOnly
                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 font-mono truncate"
                             />
                             <button 
                               onClick={() => setEditingImageId(section.id)}
                               className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                             >
                               Replace Image
                             </button>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">
                            Supported: JPG, PNG, WebP. Max size: 2MB.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {pageSections.length === 0 && (
                   <div className="text-center py-12 text-slate-400 italic">
                     Select a page from the sidebar to start editing.
                   </div>
                )}

              </div>
            </div>
          </>
        )}
      </div>

      {/* Media Picker Modal */}
      {editingImageId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Select Image</h3>
              <button onClick={() => setEditingImageId(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <MediaLibrary 
                selectable 
                onSelect={handleImageSelect} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

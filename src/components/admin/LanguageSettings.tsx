import React, { useState, useEffect } from 'react';
import { Globe, Users, Save, Settings, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Language, 
  getAllEmployeeLanguagePreferences, 
  setEmployeeLanguagePreference,
  getCurrentLanguage,
  setCurrentLanguage,
  type EmployeeLanguagePreference 
} from '../../utils/i18nManager';

export function LanguageSettings() {
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguage());
  const [employeePreferences, setEmployeePreferences] = useState<EmployeeLanguagePreference[]>([]);
  const [mockEmployees] = useState([
    { id: 'emp-1', name: 'Ion Popescu', role: 'Driver', email: 'ion@shiftmyhome.com' },
    { id: 'emp-2', name: 'Maria Kovács', role: 'Customer Support', email: 'maria@shiftmyhome.com' },
    { id: 'emp-3', name: 'John Smith', role: 'Operations Manager', email: 'john@shiftmyhome.com' },
    { id: 'emp-4', name: 'Elena Nagy', role: 'Driver', email: 'elena@shiftmyhome.com' },
    { id: 'emp-5', name: 'Andrei Popa', role: 'Dispatcher', email: 'andrei@shiftmyhome.com' },
  ]);

  useEffect(() => {
    loadEmployeePreferences();
  }, []);

  const loadEmployeePreferences = () => {
    const prefs = getAllEmployeeLanguagePreferences();
    setEmployeePreferences(prefs);
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLang(language);
    setCurrentLanguage(language);
  };

  const handleEmployeeLanguageChange = (userId: string, language: Language, autoDetect: boolean = false) => {
    setEmployeeLanguagePreference(userId, language, autoDetect);
    loadEmployeePreferences();
  };

  const getEmployeeLanguage = (userId: string): Language => {
    const pref = employeePreferences.find(p => p.userId === userId);
    return pref?.language || 'en';
  };

  const getEmployeeAutoDetect = (userId: string): boolean => {
    const pref = employeePreferences.find(p => p.userId === userId);
    return pref?.autoDetect || false;
  };

  const languageOptions: { value: Language; label: string; flag: string }[] = [
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'ro', label: 'Română', flag: '🇷🇴' },
    { value: 'hu', label: 'Magyar', flag: '🇭🇺' },
  ];

  return (
    <div className="space-y-6">
      {/* Global Language Settings */}
      <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-600" />
            Global Language Settings
          </CardTitle>
          <CardDescription>
            Set the default language for the entire platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleLanguageChange(option.value)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all
                  ${
                    currentLang === option.value
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="text-4xl mb-3">{option.flag}</div>
                <div className="text-lg font-semibold mb-1">{option.label}</div>
                <div className="text-sm text-gray-500">
                  {option.value.toUpperCase()}
                </div>
                {currentLang === option.value && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 fill-purple-100" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Customers will see content in their browser's default language if supported, 
              or English as fallback. Employees can set their own preferences below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Employee Language Preferences */}
      <Card className="bg-white/50 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Employee Language Preferences
          </CardTitle>
          <CardDescription>
            Manage language settings for each team member (Romanian, Hungarian, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockEmployees.map((employee) => {
              const empLang = getEmployeeLanguage(employee.id);
              const autoDetect = getEmployeeAutoDetect(employee.id);
              
              return (
                <div
                  key={employee.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-gray-50/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{employee.name}</h4>
                          <p className="text-sm text-gray-600">{employee.email}</p>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
                      {employee.role}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleEmployeeLanguageChange(employee.id, option.value, false)}
                        className={`
                          p-3 rounded-lg border transition-all text-center
                          ${
                            empLang === option.value && !autoDetect
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="text-2xl mb-1">{option.flag}</div>
                        <div className="text-xs font-medium">{option.label}</div>
                      </button>
                    ))}

                    <button
                      onClick={() => handleEmployeeLanguageChange(employee.id, empLang, true)}
                      className={`
                        p-3 rounded-lg border transition-all text-center
                        ${
                          autoDetect
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Globe className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <div className="text-xs font-medium">Auto-detect</div>
                    </button>
                  </div>

                  {autoDetect && (
                    <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                      Language will be auto-detected from browser settings
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>🌍 Multi-ethnic Support:</strong> Each employee can work in their native language 
              (Romanian, Hungarian, English). This improves efficiency and reduces communication errors 
              when hiring team members from different backgrounds.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Language Coverage Statistics */}
      <Card className="bg-gradient-to-br from-green-500/10 via-teal-500/10 to-blue-500/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-600" />
            Language Coverage Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languageOptions.map((option) => {
              const count = mockEmployees.filter(emp => getEmployeeLanguage(emp.id) === option.value).length;
              const percentage = ((count / mockEmployees.length) * 100).toFixed(0);
              
              return (
                <div key={option.value} className="text-center">
                  <div className="text-4xl mb-2">{option.flag}</div>
                  <div className="text-2xl font-bold mb-1">{count}</div>
                  <div className="text-sm text-gray-600">{option.label} speakers</div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage}% of team</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

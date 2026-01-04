import React, { useState } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Settings,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  FileText,
  Smartphone,
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  DollarSign,
  Clock,
  Layout,
  Zap,
  CalculatorIcon,
} from "lucide-react";
import {
  NotificationTrigger,
  NotificationLog,
  DeallocationRule,
  DEFAULT_TRIGGERS,
  DEFAULT_DEALLOCATION_RULES,
  MOCK_LOGS,
  AVAILABLE_VARIABLES,
} from "../../../utils/notificationTemplates";

export function NotificationSystem() {
  const [activeTab, setActiveTab] = useState<"triggers" | "rules" | "logs">(
    "triggers"
  );

  // State
  const [triggers, setTriggers] =
    useState<NotificationTrigger[]>(DEFAULT_TRIGGERS);
  const [rules, setRules] = useState<DeallocationRule[]>(
    DEFAULT_DEALLOCATION_RULES
  );
  const [logs] = useState<NotificationLog[]>(MOCK_LOGS);

  // Editor State
  const [editingTrigger, setEditingTrigger] =
    useState<NotificationTrigger | null>(null);
  const [editTab, setEditTab] = useState<"email" | "sms" | "preview">("email");
  const [tempSubject, setTempSubject] = useState("");
  const [tempBody, setTempBody] = useState("");
  const [tempSms, setTempSms] = useState("");
  const [tempDelay, setTempDelay] = useState<number>(0);

  // Fee Simulator State
  const [simJobValue, setSimJobValue] = useState<number>(100);
  const [simHours, setSimHours] = useState<number>(48);
  const [simResult, setSimResult] = useState<{
    fee: number;
    ruleId: string;
  } | null>(null);

  // --- ACTIONS ---

  const calculateFee = () => {
    const rule = rules.find((r) => {
      if (r.maxHoursBefore === null) return simHours >= r.minHoursBefore;
      return simHours >= r.minHoursBefore && simHours < r.maxHoursBefore;
    });

    if (rule) {
      const fee =
        rule.feeType === "fixed"
          ? rule.value
          : simJobValue * (rule.value / 100);
      setSimResult({ fee, ruleId: rule.id });
    } else {
      setSimResult(null);
    }
  };

  const toggleTrigger = (id: string, channel: "email" | "sms" | "push") => {
    setTriggers((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            channels: {
              ...t.channels,
              [channel]: !t.channels[channel],
            },
          };
        }
        return t;
      })
    );
  };

  const openEditor = (trigger: NotificationTrigger) => {
    setEditingTrigger(trigger);
    setTempSubject(trigger.emailTemplate.subject);
    setTempBody(trigger.emailTemplate.body);
    setTempSms(trigger.smsTemplate.text);
    setTempDelay(trigger.delay || 0);
    setEditTab("email");
  };

  const saveEditor = () => {
    if (!editingTrigger) return;
    setTriggers((prev) =>
      prev.map((t) => {
        if (t.id === editingTrigger.id) {
          return {
            ...t,
            delay: tempDelay,
            emailTemplate: { subject: tempSubject, body: tempBody },
            smsTemplate: { text: tempSms },
          };
        }
        return t;
      })
    );
    setEditingTrigger(null);
  };

  const sendTest = () => {
    alert(
      `🧪 Test sent to admin (System Default)\n\nSubject: ${tempSubject}\nChannel: ${editTab.toUpperCase()}`
    );
  };

  const updateRule = (
    id: string,
    field: keyof DeallocationRule,
    value: any
  ) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const calculateSimulatedFee = () => {
    // Logic matching the diagram exactly
    const rule = rules.find((r) => {
      if (r.maxHoursBefore === null) return simHours >= r.minHoursBefore;
      return simHours >= r.minHoursBefore && simHours < r.maxHoursBefore;
    });

    if (!rule) return 0;
    if (rule.feeType === "fixed") return rule.value;
    return (simJobValue * rule.value) / 100;
  };

  const calculatedFee = calculateSimulatedFee();

  // --- RENDER HELPERS ---

  const renderVariablePills = () => (
    <div className="flex flex-wrap gap-2 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
      <span className="text-xs font-bold text-slate-500 w-full uppercase mb-1">
        Available Variables:
      </span>
      {AVAILABLE_VARIABLES.map((v) => (
        <div
          key={v.name}
          className="text-xs bg-white border border-slate-200 px-2 py-1 rounded shadow-sm text-slate-600 hover:text-blue-600 cursor-copy group relative"
          title={v.desc}
          onClick={() => {
            navigator.clipboard.writeText(`{{${v.name}}}`);
            // simple toast could go here
          }}
        >
          {`{{${v.name}}}`}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-slate-800 text-white text-[10px] p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {v.desc}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Communication & Automation Engine
          </h1>
          <p className="text-slate-500 mt-1">
            Manage triggers, automation rules, templates, and communication
            logs.
          </p>
        </div>

        {/* TAB NAV */}
        <div className="flex p-1 bg-slate-100 rounded-lg self-start">
          <button
            onClick={() => setActiveTab("triggers")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === "triggers"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Zap className="w-4 h-4" />
            Automation Rules
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === "rules"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Pricing & Rules
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              activeTab === "logs"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            Logs & Audit
          </button>
        </div>
      </div>

      {/* --- CONTENT: TRIGGERS --- */}
      {activeTab === "triggers" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Channels
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {triggers.map((trigger) => (
                  <tr
                    key={trigger.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            trigger.category === "payment"
                              ? "bg-green-100 text-green-600"
                              : trigger.category === "journey"
                              ? "bg-blue-100 text-blue-600"
                              : trigger.category === "feedback"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {trigger.category === "payment" ? (
                            <DollarSign className="w-4 h-4" />
                          ) : trigger.category === "journey" ? (
                            <Layout className="w-4 h-4" />
                          ) : trigger.category === "feedback" ? (
                            <MessageSquare className="w-4 h-4" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {trigger.name}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">
                            {trigger.category} Event
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          trigger.recipient === "customer"
                            ? "bg-indigo-50 text-indigo-700"
                            : trigger.recipient === "driver"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {trigger.recipient}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleTrigger(trigger.id, "email")}
                          className={`p-1.5 rounded transition-all ${
                            trigger.channels.email
                              ? "bg-blue-100 text-blue-600"
                              : "bg-slate-100 text-slate-300"
                          }`}
                          title="Toggle Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleTrigger(trigger.id, "sms")}
                          className={`p-1.5 rounded transition-all ${
                            trigger.channels.sms
                              ? "bg-green-100 text-green-600"
                              : "bg-slate-100 text-slate-300"
                          }`}
                          title="Toggle SMS"
                        >
                          <Smartphone className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditor(trigger)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 ml-auto"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Template
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CONTENT: RULES --- */}
      {activeTab === "rules" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Deallocation Fee Logic
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Configure automatic fees charged to drivers when they are removed
              from a job. The system checks the time difference between
              deallocation and job start time.
            </p>

            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                      Time Before Job
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                      Fee Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                      Example Calculation (Job £100)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rules.map((rule, idx) => (
                    <tr key={rule.id}>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {rule.maxHoursBefore === null
                          ? `More than ${rule.minHoursBefore} hours`
                          : `${rule.minHoursBefore} – ${rule.maxHoursBefore} hours`}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={rule.feeType}
                          onChange={(e) =>
                            updateRule(rule.id, "feeType", e.target.value)
                          }
                          className="text-sm border-slate-200 rounded px-2 py-1"
                        >
                          <option value="fixed">Fixed Amount (£)</option>
                          <option value="percent">Percentage (%)</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={rule.value}
                            onChange={(e) =>
                              updateRule(
                                rule.id,
                                "value",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-20 border border-slate-300 rounded px-2 py-1 text-sm"
                          />
                          <span className="text-sm text-slate-500">
                            {rule.feeType === "fixed" ? "£" : "%"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {rule.feeType === "fixed"
                          ? `£${rule.value.toFixed(2)}`
                          : `£${(100 * (rule.value / 100)).toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                <Save className="w-4 h-4" />
                Save Rules
              </button>
            </div>
          </div>

          {/* SIMULATOR */}
          <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CalculatorIcon className="w-5 h-5 text-indigo-400" />
              Fee Simulator (Test Your Logic)
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Job Value (£)
                </label>
                <input
                  type="number"
                  value={simJobValue}
                  onChange={(e) => setSimJobValue(parseFloat(e.target.value))}
                  className="bg-slate-900 border border-slate-600 rounded px-3 py-2 w-32 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Hours Before Job
                </label>
                <input
                  type="number"
                  value={simHours}
                  onChange={(e) => setSimHours(parseFloat(e.target.value))}
                  className="bg-slate-900 border border-slate-600 rounded px-3 py-2 w-32 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <button
                onClick={calculateFee}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors"
              >
                Calculate Fee
              </button>

              {simResult && (
                <div className="ml-auto bg-slate-700/50 p-4 rounded-lg border border-slate-600 min-w-[200px] animate-in fade-in slide-in-from-right-4">
                  <div className="text-xs text-slate-400 uppercase">
                    Calculated Fee
                  </div>
                  <div className="text-2xl font-bold text-white">
                    £{simResult.fee.toFixed(2)}
                  </div>
                  <div className="text-xs text-indigo-300 mt-1">
                    Matched Rule ID: {simResult.ruleId}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT: LOGS --- */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Filters Toolbar */}
          <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                  Date/Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                  Recipient
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">
                  Channel
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">
                    {log.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {log.event}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {log.recipient}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {log.channel === "email" && (
                      <Mail className="w-4 h-4 text-blue-500 mx-auto" />
                    )}
                    {log.channel === "sms" && (
                      <Smartphone className="w-4 h-4 text-green-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        log.status === "delivered" || log.status === "opened"
                          ? "bg-green-100 text-green-800"
                          : log.status === "sent"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- EDITOR MODAL --- */}
      {editingTrigger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Edit Template: {editingTrigger.name}
                </h3>
                <p className="text-sm text-slate-500">
                  Customize the content sent to {editingTrigger.recipient}s.
                </p>
              </div>
              <button
                onClick={() => setEditingTrigger(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="flex gap-6 h-full">
                {/* Left: Inputs */}
                <div className="flex-1 flex flex-col gap-4">
                  {/* Tabs */}
                  <div className="flex bg-white p-1 rounded-lg border border-slate-200 w-fit">
                    <button
                      onClick={() => setEditTab("email")}
                      className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-all ${
                        editTab === "email"
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Mail className="w-4 h-4" /> Email
                    </button>
                    <button
                      onClick={() => setEditTab("sms")}
                      className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-all ${
                        editTab === "sms"
                          ? "bg-green-50 text-green-700"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" /> SMS
                    </button>
                    <button
                      onClick={() => setEditTab("preview")}
                      className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-all ${
                        editTab === "preview"
                          ? "bg-purple-50 text-purple-700"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" /> Preview
                    </button>
                  </div>

                  {editTab === "email" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                      {renderVariablePills()}

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-1">
                            Email Subject
                          </label>
                          <input
                            type="text"
                            value={tempSubject}
                            onChange={(e) => setTempSubject(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Delay (mins)
                          </label>
                          <input
                            type="number"
                            value={tempDelay}
                            onChange={(e) =>
                              setTempDelay(parseInt(e.target.value) || 0)
                            }
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0 = Instant"
                          />
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col">
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          Email Body (HTML)
                        </label>
                        <textarea
                          value={tempBody}
                          onChange={(e) => setTempBody(e.target.value)}
                          className="w-full flex-1 min-h-[300px] p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          Standard HTML tags supported (p, br, b, strong, ul,
                          li).
                        </p>
                      </div>
                    </div>
                  )}

                  {editTab === "sms" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                      {renderVariablePills()}
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                          SMS Text
                        </label>
                        <div className="relative">
                          <textarea
                            value={tempSms}
                            onChange={(e) => setTempSms(e.target.value)}
                            maxLength={160}
                            className="w-full min-h-[150px] p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                          />
                          <div className="absolute bottom-3 right-3 text-xs font-bold text-slate-400">
                            {tempSms.length} / 160 chars
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Keep SMS short and transactional. Avoid complex
                          variables if possible.
                        </p>
                      </div>
                    </div>
                  )}

                  {editTab === "preview" && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                      <div className="bg-white border rounded-xl shadow-sm p-8 max-w-2xl mx-auto w-full">
                        <div className="border-b pb-4 mb-6">
                          <h4 className="text-xl font-bold text-slate-900">
                            {tempSubject.replace(/{{.*?}}/g, "Sample Value")}
                          </h4>
                          <div className="text-sm text-slate-500 mt-1">
                            To: {editingTrigger.recipient}@example.com
                          </div>
                        </div>
                        <div
                          className="prose prose-sm max-w-none text-slate-700"
                          dangerouslySetInnerHTML={{
                            __html: tempBody.replace(
                              /{{.*?}}/g,
                              '<span class="bg-yellow-100 px-1 rounded text-yellow-800 font-mono text-xs">Sample</span>'
                            ),
                          }}
                        />
                      </div>

                      {tempSms && (
                        <div className="bg-white border rounded-xl shadow-sm p-4 max-w-sm mx-auto w-full border-l-4 border-l-green-500">
                          <div className="font-bold text-xs text-slate-400 uppercase mb-2">
                            SMS Preview
                          </div>
                          <div className="p-3 bg-slate-100 rounded-lg text-slate-800 text-sm">
                            {tempSms.replace(/{{.*?}}/g, "[Sample]")}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-between gap-3">
              <button
                onClick={sendTest}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 font-bold rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Zap className="w-4 h-4 text-orange-500" />
                Send Test
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingTrigger(null)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditor}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200"
                >
                  <Save className="w-4 h-4" />
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationSystem;

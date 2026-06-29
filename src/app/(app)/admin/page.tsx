"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/Button";
import { getSystemSettings, updateSystemSetting, getAdminAuditLogs, SystemSetting, AuditLog } from "@/lib/actions/adminSettings";
import { getPricingRules, getPricingFormulas, updatePricingRule, updatePricingFormulaExpression, PricingRule, PricingFormula } from "@/lib/actions/pricingEngine";
import { getAdminRoles, getUserRoleAssignments, assignUserRole, AdminRole, UserRoleAssignment } from "@/lib/actions/permissions";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";

export default function AdminPage() {
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<"settings" | "pricing" | "permissions" | "audit">("settings");
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings State
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [taxRate, setTaxRate] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState("");
  const [aiPricing, setAiPricing] = useState("");

  // Pricing State
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [formulas, setFormulas] = useState<PricingFormula[]>([]);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
  const [marginPct, setMarginPct] = useState("");
  const [seasonalCoeff, setSeasonalCoeff] = useState("");

  // Permissions State
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [assignments, setAssignments] = useState<UserRoleAssignment[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [settingsRes, pricingRes, formulasRes, rolesRes, assignmentsRes, logsRes] = await Promise.all([
        getSystemSettings(),
        getPricingRules(),
        getPricingFormulas(),
        getAdminRoles(),
        getUserRoleAssignments(),
        getAdminAuditLogs(),
      ]);

      setSettings(settingsRes);
      const tax = settingsRes.find(s => s.setting_key === "default_tax_rate")?.setting_value || "15.00";
      const maint = settingsRes.find(s => s.setting_key === "system_maintenance_mode")?.setting_value || "false";
      const ai = settingsRes.find(s => s.setting_key === "ai_pricing_enabled")?.setting_value || "false";
      setTaxRate(tax);
      setMaintenanceMode(maint);
      setAiPricing(ai);

      setPricingRules(pricingRes);
      if (pricingRes.length > 0) {
        setSelectedRuleId(pricingRes[0].id);
        setMarginPct(pricingRes[0].margin_percentage.toString());
        setSeasonalCoeff(pricingRes[0].seasonal_coefficient.toString());
      }
      setFormulas(formulasRes);

      setRoles(rolesRes);
      setAssignments(assignmentsRes);
      setAuditLogs(logsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSystemSetting("default_tax_rate", taxRate);
    await updateSystemSetting("system_maintenance_mode", maintenanceMode);
    await updateSystemSetting("ai_pricing_enabled", aiPricing);
    alert("System configurations updated!");
    await loadData();
  };

  const handleUpdatePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRuleId === null) return;
    const margin = parseFloat(marginPct);
    const coeff = parseFloat(seasonalCoeff);
    if (isNaN(margin) || isNaN(coeff)) return;

    await updatePricingRule(selectedRuleId, {
      margin_percentage: margin,
      seasonal_coefficient: coeff,
    });
    alert("Pricing configurations updated!");
    await loadData();
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const assignment = assignments.find(a => a.email === selectedUserEmail);
    const roleId = parseInt(selectedRoleId, 10);
    if (!assignment || isNaN(roleId)) {
      alert("Invalid user or role selected.");
      return;
    }

    const res = await assignUserRole(assignment.user_id, roleId);
    if (res.success) {
      alert("Role assigned successfully!");
      setSelectedUserEmail("");
      setSelectedRoleId("");
      await loadData();
    } else {
      alert(res.error);
    }
  };

  if (isLoading) {
    return <p className="text-gray-500 py-12 text-center">Loading Admin Configurations...</p>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl pb-10 pr-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Super Admin Panel</h1>
        <p className="text-sm mt-1 text-slate-500">Configure global parameters, customize pricing engines, manage RBAC permissions, and view audit history.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-150 gap-4 mb-4">
        {(["settings", "pricing", "permissions", "audit"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-sm font-semibold capitalize border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600 font-extrabold"
                : "border-transparent text-gray-500 hover:text-slate-700"
            }`}
          >
            {tab === "pricing" ? "Pricing Engine" : tab === "permissions" ? "Permissions & RBAC" : tab === "audit" ? "Audit Trails" : tab}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Form controls */}
        <div className="w-full lg:w-3/5">
          {activeTab === "settings" && (
            <div className="bg-white shadow-md p-6 rounded-xl flex flex-col gap-5">
              <h3 className="font-bold text-slate-800 border-b border-gray-100 pb-3">Global Configurations</h3>
              <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500">Default Value Added Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500">System Maintenance Mode</label>
                  <select
                    value={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  >
                    <option value="false">Active / Operational</option>
                    <option value="true">Locked / Maintenance Mode</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500">AI Pricing Fluctuation Engine</label>
                  <select
                    value={aiPricing}
                    onChange={(e) => setAiPricing(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  >
                    <option value="false">Disabled / Manual Margins</option>
                    <option value="true">Enabled / Autonomous AI Pricing</option>
                  </select>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button type="submit" variant="primary" className="cursor-pointer">Save System settings</Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="flex flex-col gap-6">
              <div className="bg-white shadow-md p-6 rounded-xl flex flex-col gap-5">
                <h3 className="font-bold text-slate-800 border-b border-gray-100 pb-3">Configure Active Pricing Rules</h3>
                <form onSubmit={handleUpdatePricing} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Standard Margin Percentage (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={marginPct}
                      onChange={(e) => setMarginPct(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500">Seasonal Adjustment Coefficient</label>
                    <input
                      type="number"
                      step="0.01"
                      value={seasonalCoeff}
                      onChange={(e) => setSeasonalCoeff(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button type="submit" variant="primary" className="cursor-pointer">Update Pricing Weights</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div className="bg-white shadow-md p-6 rounded-xl flex flex-col gap-5">
              <h3 className="font-bold text-slate-800 border-b border-gray-100 pb-3">Assign RBAC Privileges</h3>
              <form onSubmit={handleAssignRole} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500">Select Administrative Employee</label>
                  <select
                    value={selectedUserEmail}
                    onChange={(e) => setSelectedUserEmail(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                  >
                    <option value="">Select User...</option>
                    {assignments.map(a => (
                      <option key={a.id} value={a.email}>{a.email}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500">Select Administrative Privilege Role</label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-white"
                  >
                    <option value="">Select Role...</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.role_name}</option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button type="submit" variant="primary" className="cursor-pointer">Assign Permissions</Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="bg-white shadow-md p-6 rounded-xl">
              <h3 className="font-bold text-slate-800 border-b border-gray-100 pb-3 mb-4">Security Audit Trails</h3>
              <div className="overflow-y-auto max-h-[400px] flex flex-col gap-4 pr-2">
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No audit records logged.</p>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-700">{log.action_type}</span>
                        <span className="text-[10px] text-gray-400">{formatDate(log.created_at)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{log.details}</p>
                      <p className="text-[10px] text-indigo-500 mt-0.5">By: {log.user_email}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Reference info card */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h4 className="font-semibold text-sm text-slate-800 mb-4 border-b border-slate-100 pb-2">Active Configuration Values</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex justify-between">
                <span className="text-gray-500">VAT Tax rate:</span>
                <span className="font-bold text-indigo-600">{taxRate}%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Maintenance mode:</span>
                <span className="font-bold text-indigo-600">{maintenanceMode === "true" ? "ON" : "OFF"}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">AI Price Fluctuations:</span>
                <span className="font-bold text-indigo-600">{aiPricing === "true" ? "ON" : "OFF"}</span>
              </li>
            </ul>
          </div>

          {activeTab === "pricing" && (
            <div className="bg-white shadow-md p-6 rounded-xl">
              <h4 className="font-semibold text-sm text-slate-800 mb-4 border-b border-slate-100 pb-2">Pricing Formulas</h4>
              <div className="flex flex-col gap-3">
                {formulas.map(f => (
                  <div key={f.id} className="text-xs">
                    <p className="font-bold text-slate-700">{f.formula_name}</p>
                    <code className="block bg-slate-50 p-2 rounded mt-1 font-mono text-[10px] text-indigo-600">{f.formula_expression}</code>
                    <p className="text-[10px] text-gray-400 mt-1">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

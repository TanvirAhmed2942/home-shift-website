import React, { useState } from 'react';
import { Truck, DollarSign, Edit2, Save, X, AlertCircle } from 'lucide-react';
import { VEHICLE_TYPES, EXTRAS_CATALOG, GLOBAL_VOLUME_MARGIN } from '../../utils/pricingEngine';

export function RateCards() {
  const [vehicles, setVehicles] = useState(VEHICLE_TYPES);
  const [extras, setExtras] = useState(EXTRAS_CATALOG);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [editingExtraId, setEditingExtraId] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [editingExtra, setEditingExtra] = useState<any>(null);

  // Edit vehicle
  const startEditVehicle = (vehicle: any) => {
    setEditingVehicleId(vehicle.id);
    setEditingVehicle({ ...vehicle });
  };

  const saveVehicle = () => {
    if (editingVehicle) {
      setVehicles(vehicles.map((v) => (v.id === editingVehicle.id ? editingVehicle : v)));
      setEditingVehicleId(null);
      setEditingVehicle(null);
    }
  };

  const cancelVehicleEdit = () => {
    setEditingVehicleId(null);
    setEditingVehicle(null);
  };

  // Edit extra
  const startEditExtra = (extra: any) => {
    setEditingExtraId(extra.id);
    setEditingExtra({ ...extra });
  };

  const saveExtra = () => {
    if (editingExtra) {
      setExtras(extras.map((e) => (e.id === editingExtra.id ? editingExtra : e)));
      setEditingExtraId(null);
      setEditingExtra(null);
    }
  };

  const cancelExtraEdit = () => {
    setEditingExtraId(null);
    setEditingExtra(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Rate Cards Management</h2>
        <p className="text-slate-600 mt-1">Configure vehicle pricing and extras</p>
      </div>

      {/* Global Settings Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <div className="font-semibold text-blue-900">Global Volume Margin</div>
          <div className="text-sm text-blue-700 mt-1">
            All quotes automatically include a <strong>+{((GLOBAL_VOLUME_MARGIN - 1) * 100).toFixed(0)}% safety margin</strong> on total volume to account for imperfect packing.
          </div>
        </div>
      </div>

      {/* Vehicle Rate Cards */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-600" />
            Vehicle Rate Cards
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Volume Range
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Base Fee
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Price/Mile
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Price/m³
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Min Charge
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1 Man
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2 Men
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3 Men
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                  {editingVehicleId === vehicle.id && editingVehicle ? (
                    // Edit Mode
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{vehicle.icon}</span>
                          <input
                            type="text"
                            value={editingVehicle.name}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                            className="w-32 px-2 py-1 border border-blue-300 rounded text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs">
                          <input
                            type="number"
                            value={editingVehicle.minVolume}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, minVolume: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="w-14 px-2 py-1 border border-blue-300 rounded"
                          />
                          <span>–</span>
                          <input
                            type="number"
                            value={editingVehicle.maxVolume}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, maxVolume: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="w-14 px-2 py-1 border border-blue-300 rounded"
                          />
                          <span>m³</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">£</span>
                          <input
                            type="number"
                            value={editingVehicle.baseFee}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, baseFee: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="w-16 px-2 py-1 border border-blue-300 rounded text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">£</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editingVehicle.pricePerMile}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, pricePerMile: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="w-16 px-2 py-1 border border-blue-300 rounded text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">£</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editingVehicle.pricePerCubicMeter}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, pricePerCubicMeter: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="w-16 px-2 py-1 border border-blue-300 rounded text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">£</span>
                          <input
                            type="number"
                            value={editingVehicle.minimumCharge}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, minimumCharge: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="w-16 px-2 py-1 border border-blue-300 rounded text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">£</span>
                          <input
                            type="number"
                            value={editingVehicle.crew1Man}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, crew1Man: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="w-16 px-2 py-1 border border-blue-300 rounded text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">£</span>
                          <input
                            type="number"
                            value={editingVehicle.crew2Men}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, crew2Men: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="w-16 px-2 py-1 border border-blue-300 rounded text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">£</span>
                          <input
                            type="number"
                            value={editingVehicle.crew3Men}
                            onChange={(e) => setEditingVehicle({ ...editingVehicle, crew3Men: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="w-16 px-2 py-1 border border-blue-300 rounded text-sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={saveVehicle}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelVehicleEdit}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{vehicle.icon}</span>
                          <div className="font-semibold text-slate-900">{vehicle.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {vehicle.minVolume}–{vehicle.maxVolume} m³
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">£{vehicle.baseFee.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600">£{vehicle.pricePerMile.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600">£{vehicle.pricePerCubicMeter.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-orange-600">£{vehicle.minimumCharge.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">£{vehicle.crew1Man.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">£{vehicle.crew2Men.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700">£{vehicle.crew3Men.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => startEditVehicle(vehicle)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extras Catalog */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Extras Catalog
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Extra Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {extras.map((extra) => (
                <tr key={extra.id} className="hover:bg-slate-50 transition-colors">
                  {editingExtraId === extra.id && editingExtra ? (
                    // Edit Mode
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={editingExtra.name}
                          onChange={(e) => setEditingExtra({ ...editingExtra, name: e.target.value })}
                          className="w-full px-3 py-1 border border-blue-300 rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-xs">£</span>
                          <input
                            type="number"
                            value={editingExtra.price}
                            onChange={(e) => setEditingExtra({ ...editingExtra, price: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                            className="w-24 px-2 py-1 border border-blue-300 rounded"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={editingExtra.type}
                          onChange={(e) => setEditingExtra({ ...editingExtra, type: e.target.value })}
                          className="px-3 py-1 border border-blue-300 rounded-lg"
                        >
                          <option value="flat">Flat Rate</option>
                          <option value="per_floor">Per Floor</option>
                          <option value="per_item">Per Item</option>
                          <option value="per_hour">Per Hour</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={saveExtra}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelExtraEdit}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{extra.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">£{extra.price.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {extra.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => startEditExtra(extra)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
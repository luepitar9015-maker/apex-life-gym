import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Search, Filter, Play, Clock, Flame, CheckCircle, ChevronRight } from 'lucide-react';
import { fetchExercises } from '../services/api.js';

export const RoutinesView: React.FC = () => {
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    fetchExercises().then((data) => setExercises(data));
  }, []);

  const muscles = [
    { id: 'ALL', label: 'Todos' },
    { id: 'CHEST', label: 'Pecho' },
    { id: 'BACK', label: 'Espalda' },
    { id: 'LEGS_QUADRICEPS', label: 'Pierna / Cuádriceps' },
    { id: 'SHOULDERS', label: 'Hombros' },
    { id: 'TRICEPS', label: 'Tríceps' },
  ];

  const routineDays = [
    {
      day: 1,
      title: 'Día 1: Empuje (Pecho, Hombro, Tríceps)',
      focus: 'Hipertrofia & Fuerza',
      exercisesCount: 5,
      exercises: [
        { name: 'Press de Banca Plano con Barra', sets: 4, reps: '8-10', rpe: 8.5, rest: '120s' },
        { name: 'Press Militar de Hombro con Barra', sets: 3, reps: '10-12', rpe: 8.0, rest: '90s' },
        { name: 'Press Inclinado con Mancuernas', sets: 4, reps: '10-12', rpe: 8.5, rest: '90s' },
        { name: 'Elevaciones Laterales en Polea', sets: 4, reps: '12-15', rpe: 9.0, rest: '60s' },
        { name: 'Extensión de Tríceps con Cuerda', sets: 3, reps: '12-15', rpe: 9.0, rest: '60s' },
      ]
    },
    {
      day: 2,
      title: 'Día 2: Tirón (Espalda & Bíceps)',
      focus: 'Densidad y Amplitud',
      exercisesCount: 5,
      exercises: [
        { name: 'Peso Muerto Convencional', sets: 3, reps: '5-6', rpe: 8.5, rest: '150s' },
        { name: 'Dominadas con Agarre Prono', sets: 4, reps: '8-10', rpe: 8.5, rest: '90s' },
        { name: 'Remo con Barra en T', sets: 4, reps: '10-12', rpe: 8.0, rest: '90s' },
        { name: 'Curl de Bíceps en Banco Inclinado', sets: 3, reps: '10-12', rpe: 8.5, rest: '60s' },
        { name: 'Face Pulls en Polea Alta', sets: 4, reps: '15', rpe: 8.0, rest: '60s' },
      ]
    },
    {
      day: 3,
      title: 'Día 3: Pierna Completa & Glúteo',
      focus: 'Fuerza Muscular',
      exercisesCount: 5,
      exercises: [
        { name: 'Sentadilla Trasera con Barra (Squat)', sets: 4, reps: '6-8', rpe: 8.5, rest: '180s' },
        { name: 'Prensa Inclinada 45°', sets: 4, reps: '10-12', rpe: 8.5, rest: '90s' },
        { name: 'Peso Muerto Rumano con Mancuernas', sets: 4, reps: '10-12', rpe: 8.0, rest: '90s' },
        { name: 'Curl Femoral Tumbado', sets: 3, reps: '12-15', rpe: 9.0, rest: '60s' },
        { name: 'Elevación de Talones para Gemelos', sets: 4, reps: '15-20', rpe: 9.5, rest: '45s' },
      ]
    },
  ];

  const currentRoutineDay = routineDays.find(d => d.day === activeDay) || routineDays[0];

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === 'ALL' || ex.primaryMuscle === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>Planificador de Rutinas & Biblioteca de Ejercicios</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Estructura microciclos semanales con sobrecarga progresiva, RPE objetivo y series efectivas.
          </p>
        </div>

        <button className="btn btn-primary">
          <Plus size={18} /> Crear Nueva Rutina
        </button>
      </div>

      {/* Routine Detail Card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-active" style={{ marginBottom: '0.5rem' }}>
              Plantilla Oficial del Gimnasio
            </span>
            <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Plan Hipertrofia Elite (Push / Pull / Legs)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Frecuencia 2 recomendada para intermedios y avanzados • 3 a 6 días por semana
            </p>
          </div>

          {/* Selector de Días */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {routineDays.map(rd => (
              <button
                key={rd.day}
                className="btn"
                style={{
                  background: activeDay === rd.day ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeDay === rd.day ? '#fff' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.5rem 1rem'
                }}
                onClick={() => setActiveDay(rd.day)}
              >
                Día {rd.day}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Info */}
        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>{currentRoutineDay.title}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>Enfoque: {currentRoutineDay.focus}</span>
          </div>
          <span className="badge badge-cyan">{currentRoutineDay.exercises.length} Ejercicios Programados</span>
        </div>

        {/* Exercises Table of the Day */}
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ejercicio</th>
                <th>Series Efectivas</th>
                <th>Repeticiones</th>
                <th>RPE Objetivo</th>
                <th>Descanso</th>
                <th style={{ textAlign: 'right' }}>Técnica</th>
              </tr>
            </thead>
            <tbody>
              {currentRoutineDay.exercises.map((item, idx) => (
                <tr key={idx}>
                  <td><strong style={{ color: 'var(--primary)' }}>{idx + 1}</strong></td>
                  <td><strong style={{ color: '#fff' }}>{item.name}</strong></td>
                  <td><span className="badge badge-active">{item.sets} series</span></td>
                  <td>{item.reps}</td>
                  <td><span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>RPE {item.rpe}</span></td>
                  <td><span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {item.rest}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.72rem' }}>
                      Ver Video
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exercise Library Directory */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Biblioteca General de Ejercicios</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Explora ejercicios biomecánicamente categorizados</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {muscles.map(m => (
              <button
                key={m.id}
                className="btn"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.35rem 0.75rem',
                  background: selectedMuscle === m.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: selectedMuscle === m.id ? 'var(--primary)' : 'var(--text-muted)',
                  border: `1px solid ${selectedMuscle === m.id ? 'var(--primary)' : 'var(--border-subtle)'}`
                }}
                onClick={() => setSelectedMuscle(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filteredExercises.map((ex, i) => (
            <div key={i} style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{ex.name}</strong>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{ex.equipment}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {ex.instructions}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>{ex.mechanics}</span>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}>
                  Añadir a Rutina
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

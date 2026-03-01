import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { MASCOT, MASCOT_ALT } from '../mascot';

// ─────────────────────────────────────────────
//  VISUALIZER: ARRAYS & STRINGS
// ─────────────────────────────────────────────
function ArrayViz({ step }) {
  const demos = [
    {
      label: 'BASIC ARRAY — indexing',
      arr: [7, 14, 3, 22, 9, 41, 5],
      highlight: [], pointer: null,
      msg: 'An array stores elements at contiguous memory addresses. Each has a zero-based index.',
    },
    {
      label: 'READ — arr[2]',
      arr: [7, 14, 3, 22, 9, 41, 5],
      highlight: [2], pointer: 2,
      msg: 'Reading arr[2] → 3. O(1) — instant, no matter how big the array is.',
    },
    {
      label: 'SEARCH — find 22',
      arr: [7, 14, 3, 22, 9, 41, 5],
      highlight: [0, 1, 2, 3], pointer: 3,
      msg: 'Linear search: check each element left→right until found. Worst case O(n).',
    },
    {
      label: 'INSERT — push(99) at end',
      arr: [7, 14, 3, 22, 9, 41, 5, 99],
      highlight: [7], pointer: 7,
      msg: 'Appending to the end is O(1). Inserting in the middle shifts everything → O(n).',
    },
    {
      label: 'STRING as CHAR ARRAY',
      arr: ['H','E','L','L','O'],
      highlight: [0,1,2,3,4], pointer: null,
      msg: 'A string is just an array of characters! "HELLO" → indices 0 through 4.',
    },
  ];
  const d = demos[Math.min(step, demos.length - 1)];
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ color: 'var(--green)', fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>▶ {d.label}</div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
        {d.arr.map((val, i) => {
          const isHigh = d.highlight.includes(i);
          const isPtr = d.pointer === i;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isPtr ? 'rgba(61,255,154,0.2)' : isHigh ? 'rgba(255,214,10,0.12)' : 'rgba(255,255,255,0.04)',
                border: `3px solid ${isPtr ? 'var(--green)' : isHigh ? 'var(--yellow)' : 'var(--border)'}`,
                color: isPtr ? 'var(--green)' : isHigh ? 'var(--yellow)' : 'rgba(255,255,255,0.5)',
                fontFamily: '"Press Start 2P", monospace', fontSize: '12px',
                boxShadow: isPtr ? '0 0 14px rgba(61,255,154,0.4)' : 'none',
                transition: 'all 0.25s',
              }}>{val}</div>
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: 'var(--muted)' }}>[{i}]</div>
            </div>
          );
        })}
      </div>
      <div style={{ background: '#000', border: '2px solid var(--border)', width: '100%', padding: '12px 16px', fontFamily: '"VT323", monospace', fontSize: '19px', color: 'var(--green)', minHeight: '64px', lineHeight: 1.5 }}>
        &gt; {d.msg}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  VISUALIZER: TWO POINTER
// ─────────────────────────────────────────────
function TwoPointerViz({ step }) {
  const arr = [1, 3, 5, 7, 9, 11, 13];
  const target = 14;
  const phases = [
    { L: 0, R: 6, found: false, msg: `Place L at index 0 (val:${arr[0]}) and R at index 6 (val:${arr[6]}). Target = ${target}.` },
    { L: 0, R: 6, found: false, msg: `Sum = ${arr[0]}+${arr[6]} = ${arr[0]+arr[6]}. Too big → move R inward.` },
    { L: 0, R: 5, found: false, msg: `Sum = ${arr[0]}+${arr[5]} = ${arr[0]+arr[5]}. Still too big → move R inward.` },
    { L: 0, R: 4, found: false, msg: `Sum = ${arr[0]}+${arr[4]} = ${arr[0]+arr[4]}. Too small → move L outward.` },
    { L: 1, R: 4, found: false, msg: `Sum = ${arr[1]}+${arr[4]} = ${arr[1]+arr[4]}. Too big → move R inward.` },
    { L: 1, R: 3, found: true,  msg: `TARGET FOUND! ${arr[1]}+${arr[3]} = ${arr[1]+arr[3]}. Done in O(n)!` },
  ];
  const p = phases[Math.min(step, phases.length - 1)];
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ color: 'var(--pink)', fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>▶ FIND TWO NUMBERS SUMMING TO {target}</div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
        {arr.map((val, i) => {
          const isL = i === p.L, isR = i === p.R;
          const isFound = p.found && (isL || isR);
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <div style={{ height: '20px', fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: isFound ? 'var(--green)' : isL ? 'var(--blue)' : isR ? 'var(--pink)' : 'transparent' }}>
                {isFound ? '★' : isL && isR ? 'LR' : isL ? 'L' : isR ? 'R' : '·'}
              </div>
              <div style={{
                width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isFound ? 'rgba(61,255,154,0.2)' : isL ? 'rgba(60,172,255,0.15)' : isR ? 'rgba(255,60,172,0.15)' : 'rgba(255,255,255,0.04)',
                border: `3px solid ${isFound ? 'var(--green)' : isL ? 'var(--blue)' : isR ? 'var(--pink)' : 'var(--border)'}`,
                color: isFound ? 'var(--green)' : isL ? 'var(--blue)' : isR ? 'var(--pink)' : 'rgba(255,255,255,0.5)',
                fontFamily: '"Press Start 2P", monospace', fontSize: '12px',
                boxShadow: isFound ? '0 0 18px rgba(61,255,154,0.5)' : isL ? '0 0 10px rgba(60,172,255,0.4)' : isR ? '0 0 10px rgba(255,60,172,0.4)' : 'none',
                transition: 'all 0.3s',
              }}>{val}</div>
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: 'var(--muted)' }}>[{i}]</div>
            </div>
          );
        })}
      </div>
      {step > 0 && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}>
          <span style={{ color: 'var(--blue)' }}>{arr[p.L]}</span>
          <span style={{ color: 'var(--muted)' }}>+</span>
          <span style={{ color: 'var(--pink)' }}>{arr[p.R]}</span>
          <span style={{ color: 'var(--muted)' }}>=</span>
          <span style={{ color: p.found ? 'var(--green)' : arr[p.L]+arr[p.R] > target ? 'var(--pink)' : 'var(--yellow)' }}>{arr[p.L]+arr[p.R]}</span>
          <span style={{ color: 'var(--muted)', fontSize: '8px' }}>{p.found ? '= TARGET ✓' : arr[p.L]+arr[p.R] > target ? '> TARGET' : '< TARGET'}</span>
        </div>
      )}
      <div style={{ background: '#000', border: '2px solid var(--border)', width: '100%', padding: '12px 16px', fontFamily: '"VT323", monospace', fontSize: '19px', color: 'var(--green)', minHeight: '64px', lineHeight: 1.5 }}>
        &gt; {p.msg}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  VISUALIZER: BINARY SEARCH
// ─────────────────────────────────────────────
function BinarySearchViz({ step }) {
  const arr = [2, 8, 15, 23, 42, 56, 71, 89, 95];
  const target = 23;
  const phases = [
    { L: 0, R: 8, M: null, found: false, msg: `Array is SORTED. Set L=0, R=8. Target = ${target}.` },
    { L: 0, R: 8, M: 4,   found: false, msg: `Mid=4 → arr[4]=${arr[4]}. ${arr[4]}>target → go LEFT. R = Mid-1 = 3.` },
    { L: 0, R: 3, M: 1,   found: false, msg: `Mid=1 → arr[1]=${arr[1]}. ${arr[1]}<target → go RIGHT. L = Mid+1 = 2.` },
    { L: 2, R: 3, M: 2,   found: false, msg: `Mid=2 → arr[2]=${arr[2]}. ${arr[2]}<target → go RIGHT. L = Mid+1 = 3.` },
    { L: 3, R: 3, M: 3,   found: true,  msg: `TARGET FOUND at index 3! Only 4 steps for 9 elements. O(log n).` },
  ];
  const p = phases[Math.min(step, phases.length - 1)];
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ color: 'var(--yellow)', fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>▶ BINARY SEARCH — TARGET: {target}</div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
        {arr.map((val, i) => {
          const isM = i === p.M;
          const out = i < p.L || i > p.R;
          const isFound = p.found && isM;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ height: '20px', fontFamily: '"Press Start 2P", monospace', fontSize: '7px',
                color: isFound ? 'var(--green)' : isM ? 'var(--pink)' : (i === p.L && p.M !== null) ? 'var(--blue)' : (i === p.R && p.M !== null) ? 'var(--blue)' : 'transparent' }}>
                {isFound ? '★' : isM ? 'M' : (i===p.L && i===p.R && p.M!=null) ? 'L=R' : (i===p.L && p.M!=null) ? 'L' : (i===p.R && p.M!=null) ? 'R' : ''}
              </div>
              <div style={{
                width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isFound ? 'rgba(61,255,154,0.25)' : isM ? 'rgba(255,60,172,0.2)' : out ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)',
                border: `3px solid ${isFound ? 'var(--green)' : isM ? 'var(--pink)' : out ? 'rgba(255,255,255,0.06)' : 'var(--border)'}`,
                color: isFound ? 'var(--green)' : isM ? 'var(--pink)' : out ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                fontFamily: '"Press Start 2P", monospace', fontSize: '10px',
                boxShadow: isFound ? '0 0 18px rgba(61,255,154,0.5)' : isM ? '0 0 12px rgba(255,60,172,0.5)' : 'none',
                transition: 'all 0.3s', opacity: out ? 0.3 : 1,
              }}>{val}</div>
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: 'var(--muted)', opacity: out ? 0.4 : 1 }}>[{i}]</div>
            </div>
          );
        })}
      </div>
      {p.M !== null && (
        <div style={{ display: 'flex', gap: '16px', fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>
          <span>L=<span style={{ color: 'var(--blue)' }}>{p.L}</span></span>
          <span>R=<span style={{ color: 'var(--blue)' }}>{p.R}</span></span>
          <span>M=<span style={{ color: 'var(--pink)' }}>{p.M}</span></span>
          <span style={{ color: 'var(--yellow)' }}>arr[M]={arr[p.M]}</span>
        </div>
      )}
      <div style={{ background: '#000', border: '2px solid var(--border)', width: '100%', padding: '12px 16px', fontFamily: '"VT323", monospace', fontSize: '19px', color: 'var(--green)', minHeight: '64px', lineHeight: 1.5 }}>
        &gt; {p.msg}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  LINE-BY-LINE CODE PLAYER
//  Each line has a vizStep it should drive
// ─────────────────────────────────────────────
function CodePlayer({ lines, activeLine, isPlaying, onPlay, onPause, onReset, accent }) {
  return (
    <div style={{ background: '#000', border: `2px solid ${accent}33`, borderLeft: `4px solid ${accent}`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 14px', borderBottom: `1px solid ${accent}22`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--muted)', fontFamily: '"Press Start 2P", monospace', fontSize: '7px' }}>▶ CODE PLAYBACK</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={onReset} className="px-btn px-btn-o" style={{ fontSize: '7px', padding: '3px 8px' }}>↺</button>
          <button onClick={isPlaying ? onPause : onPlay} className={`px-btn ${isPlaying ? 'px-btn-r' : 'px-btn-g'}`} style={{ fontSize: '7px', padding: '3px 10px' }}>
            {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
          </button>
        </div>
      </div>
      <div style={{ padding: '10px 0' }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              padding: '4px 14px',
              fontFamily: '"VT323", monospace',
              fontSize: '18px',
              lineHeight: 1.6,
              background: i === activeLine ? `${accent}18` : 'transparent',
              borderLeft: i === activeLine ? `3px solid ${accent}` : '3px solid transparent',
              color: i === activeLine ? '#fff' : i < activeLine ? `${accent}88` : 'rgba(255,255,255,0.35)',
              transition: 'all 0.2s',
              whiteSpace: 'pre',
            }}
          >
            <span style={{ color: 'var(--muted)', fontSize: '13px', marginRight: '10px', userSelect: 'none' }}>{String(i+1).padStart(2,' ')}</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  LESSON DATA
//  Each slide optionally has codeLines[] where each line maps to a vizStep
// ─────────────────────────────────────────────
const LESSONS = {
  'Arrays & Strings': {
    color: 'var(--green)', colorKey: 'g',
    complexity: { time: 'O(1) read · O(n) search', space: 'O(n)' },
    maxStep: 4,
    slides: [
      {
        title: 'WHAT IS AN ARRAY?',
        text: 'An array is a contiguous block of memory storing elements of the same type. Think of it as a row of numbered boxes — each box has an address (index) and you can jump to any one instantly.',
        vizStep: 0,
      },
      {
        title: 'READING & INDEXING',
        text: 'Arrays are zero-indexed. arr[0] is the first element. Reading any element by index is O(1) — the CPU calculates the memory address directly: base_address + (index × element_size).',
        vizStep: 1,
        codeLines: ['arr = [7, 14, 3, 22, 9, 41, 5]', '', 'print(arr[2])   # → 3', 'print(arr[-1])  # → 5 (last)'],
        lineVizSteps: [0, 0, 1, 1],
      },
      {
        title: 'SEARCHING AN ARRAY',
        text: 'Without sorting, you must check each element one by one. This is Linear Search — O(n). In the worst case you scan every element before finding your target.',
        vizStep: 2,
        codeLines: ['def linear_search(arr, target):', '    for i, val in enumerate(arr):', '        if val == target:', '            return i  # O(n) worst case', '    return -1'],
        lineVizSteps: [2, 2, 2, 2, 2],
      },
      {
        title: 'INSERTING ELEMENTS',
        text: 'Appending to the end is O(1). But inserting in the middle requires shifting all subsequent elements rightward — that is O(n). Same for deletion.',
        vizStep: 3,
        codeLines: ['# O(1) — appends to end', 'arr.append(99)', '', '# O(n) — shifts elements right', 'arr.insert(2, 99)'],
        lineVizSteps: [2, 3, 3, 3, 3],
      },
      {
        title: 'STRINGS = CHAR ARRAYS',
        text: 'A string is simply an array of characters. Every string algorithm — reversals, palindrome checks, anagram detection — is really just array manipulation under the hood.',
        vizStep: 4,
        codeLines: ['s = "HELLO"', 'print(s[0])      # → "H"', 'print(s[::-1])   # → "OLLEH"', 'print(len(s))    # → 5'],
        lineVizSteps: [4, 4, 4, 4],
      },
      {
        title: '⏱ TIME COMPLEXITY',
        text: 'Know these cold. Random access is free because the CPU computes the address directly. Any operation that shifts elements pays O(n). This is why appending to the end is preferred over inserting in the middle.',
        vizStep: 0,
        complexityTable: [
          { op: 'Access by index',   best: 'O(1)',      avg: 'O(1)',      worst: 'O(1)',      note: 'Direct address calc' },
          { op: 'Search (unsorted)', best: 'O(1)',      avg: 'O(n)',      worst: 'O(n)',      note: 'Linear scan' },
          { op: 'Search (sorted)',   best: 'O(1)',      avg: 'O(log n)', worst: 'O(log n)', note: 'Binary search' },
          { op: 'Append to end',     best: 'O(1)',      avg: 'O(1)',      worst: 'O(1)',      note: 'Amortized' },
          { op: 'Insert at middle',  best: 'O(n)',      avg: 'O(n)',      worst: 'O(n)',      note: 'Shifts elements' },
          { op: 'Delete at end',     best: 'O(1)',      avg: 'O(1)',      worst: 'O(1)',      note: 'No shift needed' },
          { op: 'Delete at middle',  best: 'O(n)',      avg: 'O(n)',      worst: 'O(n)',      note: 'Shifts elements' },
        ],
      },
    ],
  },

  'The Two-Pointer Technique': {
    color: 'var(--pink)', colorKey: 'r',
    complexity: { time: 'O(n)', space: 'O(1)' },
    maxStep: 5,
    slides: [
      {
        title: 'THE BRUTE FORCE PROBLEM',
        text: 'Finding two numbers that sum to a target? The naive approach uses two nested loops — checking every possible pair. That\'s O(n²) which is painfully slow for large arrays.',
        vizStep: 0,
        codeLines: ['# BRUTE FORCE — O(n²) ❌', 'for i in range(len(arr)):', '    for j in range(i+1, len(arr)):', '        if arr[i]+arr[j] == target:', '            return [i, j]'],
        lineVizSteps: [0, 0, 0, 0, 0],
      },
      {
        title: 'THE TWO POINTER SOLUTION',
        text: 'If the array is SORTED, place one pointer at the start and one at the end. Check their sum. Too big? Move right inward. Too small? Move left outward. One pass = O(n).',
        vizStep: 0,
        codeLines: ['def two_sum(arr, target):', '    L, R = 0, len(arr)-1', '    while L < R:', '        s = arr[L] + arr[R]', '        if s == target:', '            return [L, R]', '        elif s > target: R -= 1', '        else: L += 1', '    return []'],
        lineVizSteps: [0, 0, 0, 1, 1, 5, 2, 3, 5],
      },
      {
        title: 'STEP 1 — INITIALISE',
        text: 'Set L to index 0, R to the last index. Both point at real values. The array must be sorted for this to work.',
        vizStep: 0,
        codeLines: ['# Sorted array', 'arr = [1, 3, 5, 7, 9, 11, 13]', 'L, R = 0, len(arr)-1', '# L=0 → arr[L]=1', '# R=6 → arr[R]=13'],
        lineVizSteps: [0, 0, 0, 0, 0],
      },
      {
        title: 'STEP 2 — CONVERGING',
        text: 'Watch the pointers close in. Each step either moves L right or R left depending on whether the current sum is too small or too large.',
        vizStep: 1,
        codeLines: ['s = arr[L]+arr[R]   # 1+13=14', '# 14 > target? No. Equal!', '', 's = arr[L]+arr[R]   # 1+11=12', '# 12 > 14? No. Move L.', '', 's = arr[L]+arr[R]   # 3+11=14 ✓'],
        lineVizSteps: [1, 1, 1, 2, 2, 3, 5],
      },
      {
        title: '⏱ TIME COMPLEXITY',
        text: 'The two-pointer trick turns O(n²) brute force into O(n) elegantly. The key requirement is a sorted array. Sorting itself costs O(n log n), so if you must sort first, the full solution is O(n log n).',
        vizStep: 0,
        complexityTable: [
          { op: 'Brute force (nested)', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', note: 'Every pair checked' },
          { op: 'Two pointer (pre-sorted)', best: 'O(n)', avg: 'O(n)', worst: 'O(n)', note: 'Single pass' },
          { op: 'Sort + two pointer', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', note: 'Sorting dominates' },
          { op: 'Space (two pointer)', best: 'O(1)', avg: 'O(1)', worst: 'O(1)', note: 'Only 2 variables' },
        ],
      },
    ],
  },

  'Binary Search Magic': {
    color: 'var(--yellow)', colorKey: 'y',
    complexity: { time: 'O(log n)', space: 'O(1)' },
    maxStep: 4,
    slides: [
      {
        title: 'THE DICTIONARY ANALOGY',
        text: 'Imagine finding a word in a dictionary by reading from page one. Madness. Instead, open the middle — if your word comes before, rip the right half away. If after, rip the left half.',
        vizStep: 0,
      },
      {
        title: 'THE REQUIREMENT: SORTED',
        text: 'Binary search ONLY works on sorted arrays. The sorted order is what lets us confidently discard half the data with each step. Without sorting, we cannot know which half holds our target.',
        vizStep: 0,
        codeLines: ['# MUST be sorted!', 'arr = [2,8,15,23,42,56,71,89,95]', 'target = 23', 'L, R = 0, len(arr)-1'],
        lineVizSteps: [0, 0, 0, 0],
      },
      {
        title: 'THE ALGORITHM',
        text: 'Calculate the midpoint. If arr[M] equals target, done. If arr[M] is greater, target must be left. If less, target must be right. Repeat until found or L > R.',
        vizStep: 1,
        codeLines: ['while L <= R:', '    M = (L+R)//2', '    if arr[M] == target:', '        return M', '    elif arr[M] > target:', '        R = M-1   # go LEFT', '    else:', '        L = M+1   # go RIGHT'],
        lineVizSteps: [0, 1, 1, 4, 1, 1, 2, 2],
      },
      {
        title: 'TRACE THROUGH: STEP BY STEP',
        text: 'Watch every midpoint calculation. Notice how the search space halves every single iteration — that\'s what gives O(log n) its incredible speed.',
        vizStep: 1,
        codeLines: ['# Step 1: M=4, arr[4]=42 > 23', 'R = 4-1   # R → 3', '# Step 2: M=1, arr[1]=8 < 23', 'L = 1+1   # L → 2', '# Step 3: M=2, arr[2]=15 < 23', 'L = 2+1   # L → 3', '# Step 4: M=3, arr[3]=23 == 23', 'return 3  # FOUND! ✓'],
        lineVizSteps: [1, 1, 2, 2, 3, 3, 4, 4],
      },
      {
        title: '⏱ TIME COMPLEXITY',
        text: 'O(log n) is extraordinarily fast. Each step halves the search space. With 1 billion elements, you need at most 30 comparisons. No other search algorithm beats this on sorted data.',
        vizStep: 0,
        complexityTable: [
          { op: 'Linear search',   best: 'O(1)', avg: 'O(n)',      worst: 'O(n)',      note: 'Unsorted array' },
          { op: 'Binary search',   best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', note: 'Sorted required' },
          { op: 'Space',           best: 'O(1)', avg: 'O(1)',      worst: 'O(1)',      note: 'Iterative version' },
          { op: 'Recursive space', best: 'O(log n)', avg: 'O(log n)', worst: 'O(log n)', note: 'Call stack depth' },
          { op: 'n=1,000',         best: '—',    avg: '~10 steps', worst: '10 steps',  note: 'log₂(1000)≈10' },
          { op: 'n=1,000,000,000', best: '—',    avg: '~30 steps', worst: '30 steps',  note: 'log₂(10⁹)≈30' },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────
//  COMPLEXITY TABLE — full breakdown slide
// ─────────────────────────────────────────────
function ComplexityTable({ rows, accent }) {
  const colors = { 'O(1)': 'var(--green)', 'O(log n)': 'var(--blue)', 'O(n)': 'var(--yellow)', 'O(n log n)': 'var(--pink)', 'O(n²)': '#ff4444' };
  const c = (v) => colors[v] || 'var(--muted)';
  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', gap: '2px', marginBottom: '4px' }}>
        {['OPERATION', 'BEST', 'AVG', 'WORST', 'NOTE'].map(h => (
          <div key={h} style={{ padding: '6px 10px', background: `${accent}22`, fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: accent }}>
            {h}
          </div>
        ))}
      </div>
      {/* Rows */}
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', gap: '2px', marginBottom: '2px' }}>
          <div style={{ padding: '7px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', fontFamily: '"VT323", monospace', fontSize: '17px', color: 'var(--white)' }}>
            {row.op}
          </div>
          {['best', 'avg', 'worst'].map(k => (
            <div key={k} style={{ padding: '7px 8px', background: `${c(row[k])}11`, border: `1px solid ${c(row[k])}44`, fontFamily: '"Press Start 2P", monospace', fontSize: '8px', color: c(row[k]), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {row[k]}
            </div>
          ))}
          <div style={{ padding: '7px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', fontFamily: '"VT323", monospace', fontSize: '16px', color: 'var(--muted)' }}>
            {row.note}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  COMPLEXITY BADGE — header bar
// ─────────────────────────────────────────────
function ComplexityBadge({ time, space }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <div style={{ padding: '4px 10px', border: '2px solid var(--green)', background: 'rgba(61,255,154,0.08)', fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: 'var(--green)' }}>
        T: {time}
      </div>
      <div style={{ padding: '4px 10px', border: '2px solid var(--blue)', background: 'rgba(60,172,255,0.08)', fontFamily: '"Press Start 2P", monospace', fontSize: '7px', color: 'var(--blue)' }}>
        S: {space}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────
export default function LessonModule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Viz state
  const [vizStep, setVizStep] = useState(0);

  // Code playback state
  const [activeLine, setActiveLine] = useState(-1);
  const [isCodePlaying, setIsCodePlaying] = useState(false);
  const codePlayRef = useRef(null);

  useEffect(() => {
    async function fetchModule() {
      const { data } = await supabase.from('modules').select('*').eq('id', id).single();
      if (data) setModuleData(data);
      setLoading(false);
    }
    fetchModule();
  }, [id]);

  // When slide changes, reset everything to the slide's default vizStep
  useEffect(() => {
    if (!moduleData) return;
    const lesson = LESSONS[moduleData.title];
    if (lesson) {
      const targetStep = lesson.slides[currentSlide]?.vizStep ?? 0;
      setVizStep(targetStep);
    }
    setActiveLine(-1);
    setIsCodePlaying(false);
    clearInterval(codePlayRef.current);
  }, [currentSlide, moduleData]);

  // Code playback engine
  const startCodePlay = useCallback(() => {
    if (!moduleData) return;
    const lesson = LESSONS[moduleData.title];
    if (!lesson) return;
    const slide = lesson.slides[currentSlide];
    if (!slide?.codeLines) return;

    clearInterval(codePlayRef.current);
    setActiveLine(0);
    setIsCodePlaying(true);

    let line = 0;
    codePlayRef.current = setInterval(() => {
      line++;
      if (line >= slide.codeLines.length) {
        setIsCodePlaying(false);
        clearInterval(codePlayRef.current);
        return;
      }
      setActiveLine(line);
      // Drive the visualizer from this line's mapped step
      const step = slide.lineVizSteps?.[line];
      if (step !== undefined) setVizStep(step);
    }, 900);
  }, [moduleData, currentSlide]);

  const pauseCodePlay = useCallback(() => {
    setIsCodePlaying(false);
    clearInterval(codePlayRef.current);
  }, []);

  const resetCodePlay = useCallback(() => {
    setIsCodePlaying(false);
    clearInterval(codePlayRef.current);
    setActiveLine(-1);
    if (!moduleData) return;
    const lesson = LESSONS[moduleData.title];
    if (lesson) setVizStep(lesson.slides[currentSlide]?.vizStep ?? 0);
  }, [moduleData, currentSlide]);

  // Cleanup on unmount
  useEffect(() => () => clearInterval(codePlayRef.current), []);

  const handleComplete = async () => {
    if (user && moduleData) {
      const { data: profile } = await supabase.from('profiles').select('elo').eq('id', user.id).single();
      if (profile) {
        await supabase.from('profiles').update({ elo: (profile.elo || 0) + (moduleData.xp_reward || 50) }).eq('id', user.id);
      }
    }
    setIsCompleted(true);
  };

  if (loading) return (
    <div style={{ color: 'var(--white)', padding: '100px', textAlign: 'center', fontFamily: '"Press Start 2P", monospace' }}>
      LOADING HOLODECK...
    </div>
  );
  if (!moduleData) return (
    <div style={{ color: 'var(--pink)', padding: '100px', textAlign: 'center', fontFamily: '"Press Start 2P", monospace' }}>
      MODULE NOT FOUND.
    </div>
  );

  const lesson = LESSONS[moduleData.title];
  const slides = lesson?.slides || [{ title: 'COMING SOON', text: 'Full visualization for this module is being built.', vizStep: 0, code: null }];
  const current = slides[currentSlide];
  const accent = lesson?.color || 'var(--blue)';
  const accentKey = lesson?.colorKey || 'b';
  const maxStep = lesson?.maxStep ?? 0;
  const hasCode = !!current?.codeLines && !current?.complexityTable;

  return (
    // Navbar is sticky ~64px — use calc so we don't overflow the viewport
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: 'var(--night)', overflow: 'hidden' }}>

      {/* ── MODULE TOP BAR ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(0,0,0,0.9)', borderBottom: `3px solid ${accent}`,
        padding: '10px 24px', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={MASCOT.study} alt={MASCOT_ALT} style={{ width: '38px', filter: `drop-shadow(0 0 6px ${accent})`, flexShrink: 0 }} draggable="false" />
          <div>
            <div style={{ color: 'var(--muted)', fontFamily: '"Press Start 2P", monospace', fontSize: '7px', marginBottom: '3px' }}>
              {moduleData.subject?.toUpperCase()} · {moduleData.difficulty?.toUpperCase()} · +{moduleData.xp_reward} XP
            </div>
            <div style={{ color: accent, fontFamily: '"Press Start 2P", monospace', fontSize: 'clamp(9px,1.2vw,13px)' }}>
              {moduleData.title}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {lesson && <ComplexityBadge time={lesson.complexity.time} space={lesson.complexity.space} />}
          <button onClick={() => navigate(-1)} className="px-btn px-btn-r" style={{ fontSize: '8px' }}>✕ EXIT</button>
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div style={{ flexShrink: 0, height: '3px', background: 'var(--border)' }}>
        <div style={{
          height: '100%', background: accent,
          width: `${((currentSlide + 1) / slides.length) * 100}%`,
          transition: 'width 0.4s', boxShadow: `0 0 8px ${accent}`,
        }} />
      </div>

      {isCompleted ? (
        /* ── COMPLETION SCREEN ── */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '40px', textAlign: 'center', overflowY: 'auto' }}>
          <img src={MASCOT.rank} alt={MASCOT_ALT} style={{ width: 'clamp(120px,15vw,200px)', filter: 'drop-shadow(0 0 30px rgba(255,214,10,0.6))', animation: 'mascot-float 2s ease-in-out infinite' }} draggable="false" />
          <div style={{ color: 'var(--green)', fontFamily: '"Press Start 2P", monospace', fontSize: 'clamp(14px,2.5vw,22px)', textShadow: '3px 3px 0 var(--gd)' }}>MODULE MASTERED</div>
          <div style={{ color: 'var(--yellow)', fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}>+{moduleData.xp_reward || 50} XP REWARDED</div>
          <div style={{ color: 'var(--muted)', fontSize: '20px', maxWidth: '480px', lineHeight: 1.6 }}>
            You have completed <strong style={{ color: 'var(--white)' }}>{moduleData.title}</strong>. Head to the Battle Arena to test what you learned!
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => navigate('/learn')} className="px-btn px-btn-g">◀ BACK TO ARCHIVE</button>
            <button onClick={() => navigate('/battle')} className="px-btn px-btn-r">⚔ TEST IN BATTLE</button>
          </div>
        </div>
      ) : (
        /* ── MAIN SPLIT LAYOUT ── */
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }}>

          {/* ── LEFT: BRIEFING ── */}
          <div style={{ display: 'flex', flexDirection: 'column', borderRight: '3px solid var(--border)', background: 'rgba(0,0,0,0.25)', overflow: 'hidden' }}>

            {/* Slide nav dots */}
            <div style={{
              flexShrink: 0, padding: '10px 24px', borderBottom: '2px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ color: 'var(--muted)', fontFamily: '"Press Start 2P", monospace', fontSize: '7px' }}>
                SLIDE {currentSlide + 1} / {slides.length}
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                {slides.map((_, i) => (
                  <div key={i} onClick={() => setCurrentSlide(i)} title={`Slide ${i+1}`} style={{
                    width: i === currentSlide ? '20px' : '8px', height: '8px',
                    background: i <= currentSlide ? accent : 'var(--border)',
                    opacity: i < currentSlide ? 0.5 : 1,
                    cursor: 'pointer', transition: 'all 0.2s',
                    clipPath: 'polygon(0 2px,2px 2px,2px 0,calc(100% - 2px) 0,calc(100% - 2px) 2px,100% 2px,100% calc(100% - 2px),calc(100% - 2px) calc(100% - 2px),calc(100% - 2px) 100%,2px 100%,2px calc(100% - 2px),0 calc(100% - 2px))',
                  }} />
                ))}
              </div>
            </div>

            {/* Scrollable slide content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h2 style={{
                color: accent, fontFamily: '"Press Start 2P", monospace',
                fontSize: 'clamp(10px,1.3vw,16px)', lineHeight: 1.7,
                textShadow: `2px 2px 0 ${accent}44`,
              }}>
                {current.title}
              </h2>
              <p style={{ color: 'var(--white)', fontFamily: '"VT323", monospace', fontSize: 'clamp(17px,1.6vw,22px)', lineHeight: 1.7 }}>
                {current.text}
              </p>

              {/* Code player (if slide has codeLines) */}
              {hasCode && (
                <CodePlayer
                  lines={current.codeLines}
                  activeLine={activeLine}
                  isPlaying={isCodePlaying}
                  onPlay={startCodePlay}
                  onPause={pauseCodePlay}
                  onReset={resetCodePlay}
                  accent={accent}
                />
              )}

              {/* Static code block fallback (for slides with old-style code) */}
              {!hasCode && current.code && (
                <div style={{ background: 'rgba(0,0,0,0.6)', border: `2px solid ${accent}33`, borderLeft: `4px solid ${accent}`, padding: '14px 16px' }}>
                  <pre style={{ fontFamily: '"VT323", monospace', fontSize: '18px', color: 'var(--green)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{current.code}</pre>
                </div>
              )}

              {/* Complexity table */}
              {current.complexityTable && (
                <ComplexityTable rows={current.complexityTable} accent={accent} />
              )}
            </div>

            {/* ── FIXED BOTTOM NAV — always visible ── */}
            <div style={{
              flexShrink: 0,
              padding: '14px 24px', borderTop: '2px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(0,0,0,0.6)',
            }}>
              <button
                className="px-btn px-btn-o"
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide(p => p - 1)}
                style={{ fontSize: '8px' }}
              >◀ PREV</button>

              <div style={{ color: 'var(--muted)', fontFamily: '"Press Start 2P", monospace', fontSize: '7px' }}>
                {currentSlide + 1} / {slides.length}
              </div>

              {currentSlide === slides.length - 1 ? (
                <button className={`px-btn px-btn-${accentKey}`} onClick={handleComplete} style={{ fontSize: '8px' }}>
                  ✓ COMPLETE
                </button>
              ) : (
                <button className={`px-btn px-btn-${accentKey}`} onClick={() => setCurrentSlide(p => p + 1)} style={{ fontSize: '8px' }}>
                  NEXT ▶
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT: HOLODECK ── */}
          <div style={{ display: 'flex', flexDirection: 'column', background: '#020408', position: 'relative', overflow: 'hidden' }}>
            {/* Scanlines */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, transparent 1px, transparent 4px)' }} />

            {/* Header */}
            <div style={{
              flexShrink: 0, padding: '10px 20px', borderBottom: '2px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(0,0,0,0.5)', position: 'relative', zIndex: 1,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '7px', height: '7px', background: 'var(--green)', animation: 'blink 0.6s step-end infinite' }} />
                <span style={{ color: 'var(--green)', fontFamily: '"Press Start 2P", monospace', fontSize: '8px' }}>HOLODECK LIVE</span>
              </div>
              <div style={{ color: 'var(--muted)', fontFamily: '"Press Start 2P", monospace', fontSize: '7px' }}>
                STEP {vizStep} / {maxStep}
              </div>
            </div>

            {/* Viz area — scrollable if content overflows */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
              {!lesson ? (
                <div style={{ textAlign: 'center', opacity: 0.3 }}>
                  <div style={{ fontSize: '70px' }}>⚙️</div>
                  <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', marginTop: '16px', color: 'var(--muted)' }}>VISUALIZER INCOMING</div>
                </div>
              ) : moduleData.title === 'Arrays & Strings' ? (
                <ArrayViz step={vizStep} />
              ) : moduleData.title === 'The Two-Pointer Technique' ? (
                <TwoPointerViz step={vizStep} />
              ) : moduleData.title === 'Binary Search Magic' ? (
                <BinarySearchViz step={vizStep} />
              ) : (
                <div style={{ textAlign: 'center', opacity: 0.3 }}>
                  <div style={{ fontSize: '70px' }}>⚙️</div>
                  <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', marginTop: '16px', color: 'var(--muted)' }}>VISUALIZER INCOMING</div>
                </div>
              )}
            </div>

            {/* ── FIXED BOTTOM VIZ CONTROLS ── */}
            {lesson && (
              <div style={{
                flexShrink: 0,
                padding: '12px 20px', borderTop: '2px solid var(--border)',
                display: 'flex', gap: '8px', justifyContent: 'center',
                background: 'rgba(0,0,0,0.5)', position: 'relative', zIndex: 1, flexWrap: 'wrap',
              }}>
                <button className="px-btn px-btn-o" onClick={() => { setVizStep(0); }} style={{ fontSize: '8px' }}>↺ RESET</button>
                <button className="px-btn px-btn-o" disabled={vizStep === 0} onClick={() => setVizStep(p => Math.max(0, p-1))} style={{ fontSize: '8px' }}>◀ BACK</button>
                <button className={`px-btn px-btn-${accentKey}`} disabled={vizStep >= maxStep} onClick={() => setVizStep(p => Math.min(maxStep, p+1))} style={{ fontSize: '8px' }}>STEP ▶</button>
              </div>
            )}
          </div>

        </div>
      )}

      <style>{`
        @keyframes mascot-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
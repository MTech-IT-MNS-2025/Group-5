(module
  ;; 2 pages of memory (S-box + key + data)
  (memory (export "memory") 2)

  ;; =========================
  ;; RC4 KSA (Key Scheduling)
  ;; =========================
  (func (export "ksa") (param $key i32) (param $keylen i32)
    (local $i i32)
    (local $j i32)
    (local $Si i32)
    (local $Sj i32)
    (local $keybyte i32)
    (local $ptr i32)

    ;; S-box base pointer
    (local.set $ptr (i32.const 0))

    ;; ---- S[i] = i ----
    (local.set $i (i32.const 0))
    (loop $init
      (i32.store8
        (i32.add (local.get $ptr) (local.get $i))
        (local.get $i)
      )
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $init
        (i32.lt_u (local.get $i) (i32.const 256))
      )
    )

    ;; avoid div-by-zero
    (if (i32.eqz (local.get $keylen))
      (then (return))
    )

    ;; ---- KSA mixing ----
    (local.set $j (i32.const 0))
    (local.set $i (i32.const 0))
    (loop $mix
      ;; Si = S[i]
      (local.set $Si
        (i32.load8_u (i32.add (local.get $ptr) (local.get $i)))
      )

      ;; key[i % keylen]
      (local.set $keybyte
        (i32.load8_u
          (i32.add
            (local.get $key)
            (i32.rem_u (local.get $i) (local.get $keylen))
          )
        )
      )

      ;; j = (j + Si + keybyte) % 256
      (local.set $j
        (i32.and
          (i32.add
            (i32.add (local.get $j) (local.get $Si))
            (local.get $keybyte)
          )
          (i32.const 255)
        )
      )

      ;; Sj = S[j]
      (local.set $Sj
        (i32.load8_u (i32.add (local.get $ptr) (local.get $j)))
      )

      ;; swap(S[i], S[j])
      (i32.store8 (i32.add (local.get $ptr) (local.get $i)) (local.get $Sj))
      (i32.store8 (i32.add (local.get $ptr) (local.get $j)) (local.get $Si))

      ;; i++
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $mix
        (i32.lt_u (local.get $i) (i32.const 256))
      )
    )
  )

  ;; ==================
  ;; RC4 PRGA (Encrypt)
  ;; ==================
  (func (export "rc4") (param $data i32) (param $len i32)
    (local $i i32)
    (local $j i32)
    (local $k i32)
    (local $Si i32)
    (local $Sj i32)
    (local $t i32)
    (local $ptr i32)

    ;; S-box at 0
    (local.set $ptr (i32.const 0))

    ;; i = 0, j = 0
    (local.set $i (i32.const 0))
    (local.set $j (i32.const 0))
    (local.set $k (i32.const 0))

    (loop $loop
      ;; i = (i+1) % 256
      (local.set $i
        (i32.and (i32.add (local.get $i) (i32.const 1)) (i32.const 255))
      )

      ;; Si = S[i]
      (local.set $Si
        (i32.load8_u (i32.add (local.get $ptr) (local.get $i)))
      )

      ;; j = (j + Si) % 256
      (local.set $j
        (i32.and (i32.add (local.get $j) (local.get $Si)) (i32.const 255))
      )

      ;; Sj = S[j]
      (local.set $Sj
        (i32.load8_u (i32.add (local.get $ptr) (local.get $j)))
      )

      ;; swap(S[i], S[j])
      (i32.store8 (i32.add (local.get $ptr) (local.get $i)) (local.get $Sj))
      (i32.store8 (i32.add (local.get $ptr) (local.get $j)) (local.get $Si))

      ;; t = (S[i] + S[j]) % 256
      (local.set $t
        (i32.and
          (i32.add
            (i32.load8_u (i32.add (local.get $ptr) (local.get $i)))
            (i32.load8_u (i32.add (local.get $ptr) (local.get $j)))
          )
          (i32.const 255)
        )
      )

      ;; data[k] ^= S[t]
      (i32.store8
        (i32.add (local.get $data) (local.get $k))
        (i32.xor
          (i32.load8_u (i32.add (local.get $data) (local.get $k)))
          (i32.load8_u (i32.add (local.get $ptr) (local.get $t)))
        )
      )

      ;; k++
      (local.set $k (i32.add (local.get $k) (i32.const 1)))
      (br_if $loop
        (i32.lt_u (local.get $k) (local.get $len))
      )
    )
  )
)
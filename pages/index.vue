<template>
  <div class="controls-re">
    <div class="controls-re">
      <img class="img-tonal" src="~/assets/image/tonal.png" alt="" />
      <img class="img-eye" src="~/assets/image/eye.png" alt="" />
      <img class="img-logo" src="~/assets/image/logo.png" alt="" />
    </div>
    <div class="slots">
      <div class="reel"></div>
      <div class="reel"></div>
      <div class="reel"></div>
      <div class="reel"></div>
      <div class="reel"></div>
    </div>
    <div class="win-line"></div>
    <div class="d-skull">
      <img class="img-tonal" src="~/assets/image/skull.png" alt="" />
    </div>
    <div id="debug" class="debug" style="display: none"></div>

    <!-- ควบคุมเครดิตและการเดิมพัน -->
    <div class="controls">
      <div class="credits-bet">
        <div class="win-lose-top cre-bg">
          <span class="win-lose-icon"
            ><img
              style="display: flex"
              src="~/assets/image/Wallet_alt.png"
              alt=""
          /></span>
          <input
            type="text"
            v-model="credits"
            placeholder="ระบุจำนวนเบท"
            min="1"
            :max="credits"
            readonly
          />
        </div>
        <div class="win-lose-top cre-bg">
          <span class="win-lose-icon"
            ><img
              style="display: flex"
              src="~/assets/image/Database.png"
              alt=""
          /></span>
          <input
            type="text"
            v-model="bet"
            placeholder="ระบุจำนวนเบท"
            min="1"
            :max="credits"
          />
        </div>
        <!-- ช่องรางวัล ชนะ/แพ้ -->
        <div class="win-lose cre-bg">
          <span class="win-lose-icon-two"
            ><img style="display: flex" src="~/assets/image/Frame.png" alt=""
          /></span>
          <input type="text" v-model="winMessage" readonly />
        </div>
        <!-- ตั้งค่าเปอร์เซ็นต์ชนะ -->
      </div>
      <div class="win-lose cre-bg">
        <span>เปอร์เซ็นต์การชนะ:</span>
        <input type="text" v-model="winPercentage" />
      </div>
    </div>
    <div class="d-spin">
      <button @click="toggleAutoSpin" class="auto-spin-button">
        {{ isAutoSpinning ? "stop" : "auto" }}
      </button>
      <div class="controls-re">
        <div>
          <img class="img" src="~/assets/image/boxspin.png" alt="" />
        </div>
        <div class="spin-b">
          <button @click="startRoll" class="spin-icon">
            <img class="img" src="~/assets/image/spin5.png" alt="" />
          </button>
        </div>
      </div>
      <button @click="toggleModal" class="modal-button auto-spin-button">
        เมนู
      </button>
    </div>
    <div class="" style="position: absolute; bottom: 0px; z-index: 1">
      <img
        style="transform: translate(-40px, 0px)"
        src="~/assets/image/crystal.png"
        alt=""
      />
      <img
        style="transform: translate(60px, 0px)"
        src="~/assets/image/crystal2.png"
        alt=""
      />
    </div>
    <!-- ตารางประวัติการเล่น -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <button @click="toggleModal" class="close-button">
          <img style="" src="~/assets/image/Group 4076.png" alt="" />
        </button>

        <!-- ส่วนของแท็บ -->
        <div class="tabs">
          <button
            :class="{ active: activeTab === 'rules' }"
            @click="activeTab = 'rules'"
          >
            Rules
          </button>
          <button
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            History
          </button>
          <button
            :class="{ active: activeTab === 'paytable' }"
            @click="activeTab = 'paytable'"
          >
            Paytable
          </button>
        </div>

        <!-- เนื้อหาภายในแต่ละแท็บ -->
        <div v-if="activeTab === 'rules'" class="tab-content">
          <h3>Rules</h3>
          <p>เนื้อหาเกี่ยวกับกฎกติกา...</p>
        </div>

        <div v-if="activeTab === 'history'" class="tab-content">
          <h3>ประวัติการเล่น</h3>
          <table>
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>ผลลัพธ์</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in history" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ entry }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'paytable'" class="tab-content">
          <h3>Paytable</h3>
          <p>เนื้อหาเกี่ยวกับอัตราการจ่าย...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconMap: [
        "skull",
        "red",
        "green",
        "yellow",
        "blue",
        "skull-one",
        "red-one",
        "green-one",
        "yellow-one",
        "blue-one",
        "skull-two",
        "red-two",
      ],
      iconWidth: 79,
      iconHeight: 79,
      numIcons: 12,
      timePerIcon: 70,
      indexes: [0, 0, 0, 0, 0], // เพิ่มจำนวนเป็น 5
      credits: 1000, // เครดิตเริ่มต้น
      bet: 10, // จำนวนเบทเริ่มต้น
      winPercentage: 0, // เปอร์เซ็นต์โอกาสชนะ (เช่น 30%)
      winMessage: "", // ข้อความรางวัล
      isWin: false,
      debugEl: null,
      rolling: false,
      showModal: false,
      activeTab: "rules", // ค่าเริ่มต้นคือ Rules
      history: [], // ประวัติการเล่น
      showHistoryTable: false, // ตัวแปรควบคุมการแสดงตารางประวัติ
      /*
      " 0px" red
      "78px" Skull,
      "160px", yellow
      237px Green
      "320px" Blue
      394px yellow  
      553px red
      650px Skull
      710px Blue
      869px Green
      
   
      */

      ranStartPositions: [
        "0px",
        "78px",
        "160px",
        "237px",
        "320px",
        "394px",
        "553px",
        "630px",
        "710px",
        "869px",
      ],
      // ranTargetPosition: 0,
      autoSpinInterval: null,
      isAutoSpinning: false,
    };
  },
  mounted() {
    this.debugEl = document.getElementById("debug");
  },
  methods: {
    roll(reel, offset = 0) {
      let delta = 0;

      console.log("StartY: ", reel.style.backgroundPositionY);
      reel.style.backgroundPositionY =
        this.ranStartPositions[this.ranTargetPosition]; // Reset
      if (this.isWin) {
        delta = 44;
      } else {
        delta =
          (offset + 2) * this.numIcons +
          Math.round(Math.random() * this.numIcons);
      }
      console.log("Delta: ", delta);

      return new Promise((resolve) => {
        const style = getComputedStyle(reel);
        const backgroundPositionY = parseFloat(style["background-position-y"]);
        const targetBackgroundPositionY =
          backgroundPositionY + delta * this.iconHeight;
        const normTargetBackgroundPositionY =
          targetBackgroundPositionY % (this.numIcons * this.iconHeight);

        setTimeout(() => {
          reel.style.transition = `background-position-y ${
            (8 + 1 * delta) * this.timePerIcon
          }ms cubic-bezier(.41,-0.01,.63,1.09)`;
          reel.style.backgroundPositionY = `${
            backgroundPositionY + delta * this.iconHeight
          }px`;
        }, offset * 150);

        setTimeout(() => {
          reel.style.transition = `none`;
          reel.style.backgroundPositionY = `${normTargetBackgroundPositionY}px`;
          resolve(delta % this.numIcons);
        }, (8 + 1 * delta) * this.timePerIcon + offset * 150);
      });
    },
    async rollAll() {
      this.debugEl.textContent = "rolling...";
      const reelsList = document.querySelectorAll(".slots > .reel");

      // คำนวณผลการชนะก่อนที่จะหมุน
      await this.calculateOutcome();

      // ตั้งค่าตำแหน่งเริ่มต้นแบบสุ่มเฉพาะเมื่อชนะ
      if (this.isWin) {
        this.ranTargetPosition = [
          Math.floor(Math.random() * this.ranStartPositions.length),
        ];
        console.log("ชนะรีเฟรช ", this.ranTargetPosition);
      } else {
        this.ranTargetPosition = []; // รีเซ็ตค่าเมื่อแพ้
        console.log("แพ้ไม่รีเฟรช");
      }

      // ทำการหมุนโดยใช้ตำแหน่งที่ตั้งไว้
      await Promise.all([...reelsList].map((reel, i) => this.roll(reel, i)));

      console.log("AFTER INDEXES: ", this.indexes);
      this.debugEl.textContent = this.indexes
        .map((i) => this.iconMap[i])
        .join(" - ");

      // แสดงผลหลังจากหมุนเสร็จ
      const inputElement = document.querySelector(".win-lose input"); // เลือก input ภายใน .win-lose
      if (this.isWin) {
        document.querySelector(".win-line").classList.add("show-win-line");
        inputElement.classList.add("golden-flash"); // เพิ่มคลาส golden-flash เมื่อชนะ
      } else {
        document.querySelector(".win-line").classList.remove("show-win-line");
        inputElement.classList.remove("golden-flash"); // ลบคลาส golden-flash เมื่อแพ้
      }

      // รีเซ็ต isWin หลังจากแสดงผลเสร็จสิ้น
      this.isWin = false;
      this.rolling = false;
    },
    async calculateOutcome() {
      const randomChance = Math.random() * 100;
      console.log(randomChance, this.winPercentage);

      if (randomChance <= this.winPercentage) {
        console.log("ชนะ!!!");
        const winningIndex = this.indexes[0];
        this.indexes = this.indexes.map(() => winningIndex); // บังคับให้แถวตรงกัน
        this.credits += this.bet * 2; // ชนะ จะได้ 2 เท่าของเบท
        this.winMessage = ` ${this.bet * 2} `;
        this.isWin = true;
      } else {
        console.log("แพ้!!!");
        this.credits -= this.bet; // แพ้ หักจำนวนเบทออกจากเครดิต
        this.winMessage = `แพ้ ${this.bet} `;
        this.isWin = false;
      }

      this.history.push(this.winMessage); // บันทึกประวัติการเล่น
    },

    async startRoll() {
      if (this.rolling) return;
      if (this.bet <= 0 || this.bet > this.credits) {
        alert("จำนวนเบทไม่ถูกต้อง");
        return;
      }
      document.querySelector(".win-line").classList.remove("show-win-line");
      document
        .querySelector(".win-lose input")
        .classList.remove("golden-flash");
      this.rolling = true;
      await this.rollAll();

      if (!this.isAutoSpinning) {
        clearInterval(this.autoSpinInterval); // หยุดการหมุนอัตโนมัติเมื่อเงื่อนไขไม่ครบ
      }
    },
    toggleAutoSpin() {
      if (this.isAutoSpinning) {
        clearInterval(this.autoSpinInterval); // หยุดการหมุนอัตโนมัติ
        this.autoSpinInterval = null;
        this.isAutoSpinning = false;
      } else {
        this.isAutoSpinning = true;
        this.autoSpinInterval = setInterval(() => {
          this.startRoll(); // เรียก startRoll เพื่อหมุนอัตโนมัติ
        }, 2000); // หมุนทุก ๆ 2 วินาที (กำหนดตามต้องการ)
      }
    },
    toggleModal() {
      this.showModal = !this.showModal;
    },
    beforeDestroy() {
      if (this.autoSpinInterval) clearInterval(this.autoSpinInterval); // หยุดการหมุนเมื่อถูกทำลาย
    },
  },
};
</script>

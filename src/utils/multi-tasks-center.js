import QueueElement from './multi-queue';

export default class PriorityQueue {
  constructor() {
    // this.element = element;
    // this.priority = priority;
    this.items = [];
  }

  enqueue(element, priority) {
    const queueElement = new QueueElement(element, priority);

    if (this.isEmpty()) {
      this.items.push(queueElement); // {2}
    } else {
      let added = false;
      for (let i = 0; i < this.items.length; i++) {
        if (queueElement.priority < this.items[i].priority) {
          this.items.splice(i, 0, queueElement); // {3}
          added = true;
          break;
        }
      }
      if (!added) { // {4}
        this.items.push(queueElement);
      }
    }
  }
  print() {
    console.log(this.items, 888);
  }

  isEmpty() {
    return this.items.length === 0;
  }
}


class Scheduler {
  constructor() {
    this.tasks = [], // 待运行的任务
    this.usingTask = [] // 正在运行的任务
  }
  // promiseCreator 是一个异步函数，return Promise
  add(promiseCreator) {
    return new Promise((resolve, reject) => {
      promiseCreator.resolve = resolve
      if (this.usingTask.length < 2) {
        this.usingRun(promiseCreator)
      } else {
        this.tasks.push(promiseCreator)
      }
    })
  }

  usingRun(promiseCreator) {
    this.usingTask.push(promiseCreator)
    promiseCreator().then(() => {
      promiseCreator.resolve()
      this.usingMove(promiseCreator)
      if (this.tasks.length > 0) {
        this.usingRun(this.tasks.shift())
      }
    })
  }

  usingMove(promiseCreator) {
    let index = this.usingTask.findIndex(promiseCreator)
    this.usingTask.splice(index, 1)
  }
}

const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

const scheduler = new Scheduler()

const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(400, 4)
addTask(200, 2)
addTask(300, 3)
addTask(100, 1)

// 2, 4, 3, 1

<template>
  <div
    :class="`${prefixCls}`"
    tabindex="0"
    @keydown="keydown"
  >
    <b>Structure ({{prefix?prefix:'list'}})</b>
    <div :class="`${prefixCls}-tools`">
      <span
        :class="`${prefixCls}-tools-button`"
        @click="onChangeAllFold(1)"
      > ++ </span>
      <span
        :class="`${prefixCls}-tools-button`"
        @click="onChangeAllFold(0)"
      > -- </span>
    </div>
    <div :class="`${prefixCls}-content`">
      <ac-struct-item
        ref="tree-root"
        :tree="tree"
        :tree-state="treeState"
        :nodes="nodes"
        @update="onupdate"
      />
    </div>
  </div>
</template>

<script>
const prefixCls = 'ac-struct'
import acStructItem from './ac-struct-item'

export default {
  name: 'ac-struct',
  components: {acStructItem},
  props: {
    tree: { type: Object, required: true },
    treeState: { type: Object, required: true },
    prefix: { type: String, default: "" },
  },
  data () {
    return {
      prefixCls,
      nodes : { },
    }
  },
  computed: {
  },
  watch:{
  },
  created() {
    this.$watch('treeState.selected', this.selectNode)
  },
  mounted () {
    let selected = this.treeState.selected
    if (selected) {
      if (this.nodes[selected]&&!this.nodes[selected].tree.root) {
        this.nodes[selected].updateSelected(true)
      }
    }
    //console.log('nodes:', this.nodes)
  },
  methods: {
    goToProjection (tree) {
      this.$emit('update', {goToProjection: tree, prefix: this.prefix})
    },
    selectNode(newObj, oldObj) {
      if (oldObj!==undefined&&this.nodes[oldObj]) {
        this.nodes[oldObj].updateSelected(false)
      }
      if (newObj!==undefined&&this.nodes[newObj]) {
        this.nodes[newObj].updateSelected(true)
      }
    },
    foldSelected(status) {
      if (this.treeState.selected !== undefined) {
        let node = this.nodes[this.treeState.selected]
        if (node) node.updateFold(status)
      }
    },
    keydown (event) {
      let node = this.nodes[this.treeState.selected]
      if (event.shiftKey) {
        if (node) {
          switch (event.key) {
            case 'ArrowRight':
            case 'l':
              event.preventDefault();
              this.onChangeAllFold(true, node);
              break
            case 'ArrowLeft':
            case 'h':
              event.preventDefault();
              this.onChangeAllFold(false, node);
              break
            case 'N':
              event.preventDefault();
              if (node) node.updateProNewline()
              break
          }
        }
      } else {
        switch (event.key) {
          case 'ArrowRight':
          case 'l':
            event.preventDefault();
            this.foldSelected(true);
            break
          case 'ArrowLeft':
          case 'h':
            event.preventDefault();
            this.foldSelected(false);
            break
          case ' ':
            event.preventDefault();
            this.foldSelected();
            break
          case 'ArrowUp':
          case 'k':
            event.preventDefault();
            this.changeSelect('up');
            break
          case 'ArrowDown':
          case 'j':
            event.preventDefault();
            this.changeSelect('down');
            break
          case 'p':
            event.preventDefault();
            if (node) node.updateProjection()
            break
          case 'n':
            event.preventDefault();
            if (node) node.updateNewline()
            break
          case 'o':
            event.preventDefault();
            if (node) node.updateProjection(true)
            break
          case 'g':
            event.preventDefault();
            if (node) this.goToProjection(node.tree)
            break
        }
      }
    },
    getLastChildren (tree) {
      if (tree.status.open || tree.root) {
        if (tree.children&&tree.children.length) {
          return this.getLastChildren(tree.children[tree.children.length-1])
        } else {
          return tree.path
        }
      } else {
        return tree.path
      }
    },
    getNextSibling (node) {
      if (node.tree.root) return node.tree.children[0].path
      if (node.index===node.siblingCount-1) {
        return this.getNextSibling(node.$parent)
      } else { // go to its next sibling
        return node.$parent.tree.children[node.index+1].path
      }
    },
    selectUP (node) {
      if (node.tree.root) {
        this.treeState.selected = this.getLastChildren(this.tree)
        return
      }
      if (node.index===0) {
        //if (node.$parent.tree.root) { // go to last
        //  this.treeState.selected = this.getLastChildren(this.tree)
        //} else { // go to its parent
          this.treeState.selected = node.$parent.tree.path // not skip root
        //}
      } else { // go to previous sibling or the last child of it
        let previousSibling = node.$parent.tree.children[node.index-1]
        let path = this.getLastChildren(previousSibling)
        this.treeState.selected = path
      }
    },
    selectDOWN (node) {
      if (node.tree.root) {
        this.treeState.selected = node.tree.children[0].path
        return
      }
      if (node.tree.status.open&&node.tree.children&&node.tree.children.length) { // go to its first child
        this.treeState.selected = node.tree.children[0].path
      } else if (node.index===node.siblingCount-1) { // go to its parent's next sibling
        this.treeState.selected = this.getNextSibling(node.$parent)
      } else { // go to its next sibling
        this.treeState.selected = node.$parent.tree.children[node.index+1].path
      }
    },
    changeSelect (move) {
      let node = this.nodes[this.treeState.selected]
      if (!node) {
        this.treeState.selected = this.tree.children[0].path
        return
      }
      let key = this.prefix?'tableTreeState':'treeState'
      if (move==='up') { // up
        this.selectUP(node)
        this.$emit('update', {storeUpdate: [key], changeSelect: true, prefix: this.prefix})
      } else if (move==='down') { // down
        this.selectDOWN(node)
        this.$emit('update', {storeUpdate: [key], changeSelect: true, prefix: this.prefix})
      }
    },
    onupdate (change, value, origin) {
      if (origin) {
        this.treeState.selected = origin.tree.path
      }
      change.prefix = this.prefix
      this.$emit('update', change, value, origin)
    },
    goThrough(root, func) {
      func(root)
      if (root.children) {
        for (let child of root.children) {
          this.goThrough(child, func)
        }
      }
    },
    doForAllSubTree (root, func) {
      let children = root.$children.filter(_ => _.$options.name === 'ac-struct-item')
      func(root)
      if (children) {
        for (let child of children) {
          this.doForAllSubTree(child, func)
        }
      }
    },
    onChangeAllFold(status, root) {
      if (!root) root = this.$children.find(_ => _.$options.name === 'ac-struct-item')
      if (status) {
        this.doForAllSubTree(root, _=> {
          if (_.tree.root||!_.tree.children) return
          _.onlyUpdateFold(status)
        })
      } else {
        this.doForAllSubTree(root, _=> {
          if (_.tree.root||!_.tree.children) return
          _.onlyUpdateFold(status)
        })
      }
      this.$emit('update', {prefix:this.prefix})
    }
  }
}
</script>

<style lang="scss">
$pre: ac-struct;
.#{$pre} {
  outline:none;
  flex: 1;
}
.#{$pre}-tools {
  height: 1rem;
}
.#{$pre}-tools-button {
  padding: 0 0.5rem;
}
.#{$pre}-tools-button:hover {
  background: white;
}
.#{$pre}-content {
  padding: 0 5px;
}

</style>

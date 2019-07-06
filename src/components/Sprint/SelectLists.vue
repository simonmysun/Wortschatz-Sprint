<template>
<div class="container">
  <form v-on:submit.prevent="load()">
    <ButtonGroup size="large">
      <Row>
        <i-col v-for="item in lists" :key="item" :xs="6" :sm="4" :md="2">
          <Button class="btns" :type="selected.indexOf(item) === -1 ? 'default' : 'info'" @click="selectList(item)">{{ item }}</Button>
        </i-col>
      </Row>
    </ButtonGroup>
    <div class="select-container">
      <Select class="select" v-model="componentSelect" @on-change="updateSelectedFromComponentSelect" multiple clearable>
        <Option v-for="item in lists" :value="item" :key="item">{{ item }}</Option>
      </Select>
    </div>
    <div class="text-container">
      <i-input class="text-input" v-model="vocabularyListInput" placeholder="x,y,z" clearable @on-change="calculateSelected" @on-keyup="calculateSelected" @on-clear="calculateSelected" />
      <Button type="primary" html-type="submit" :disabled="selected.length === 0">Submit</Button>
    </div>
  </form>
</div>
</template>

<script>
export default {
    name: 'SelectLists',
    props: ['lists', 'selected'],
    methods: {
        ...{
            selectList(list) {
                if(this.selected.indexOf(list) === -1) {
                    this.$emit('updateSelected', this.selected.concat(list));
                } else {
                    this.$emit('updateSelected', this.selected.filter(item => item !== list));
                }
                this.updateSelected();
            },
            updateSelectedFromComponentSelect() {
                this.$emit('updateSelected', this.componentSelect);
                this.updateSelected();
            },
            updateSelected() {
                this.$nextTick(function() {
                    this.vocabularyListInput = this.selected.join(',');
                    this.componentSelect = this.selected;
                });
            },
            calculateSelected() {
                try {
                    const res = JSON.parse('[' + this.vocabularyListInput + ']');
                    if(res.filter(x => this.lists.indexOf(x.toString()) === -1).length === 0) {
                        this.$emit('updateSelected', res.map(x => x.toString()));
                        this.$nextTick(function() {
                            this.componentSelect = this.selected;
                        });
                    }
                } catch(e) {
                    // eslint-disable-next-line
                    console.log(e);
                }
            },
            load() {
                this.$emit('load');
            }
        }
    },
    data() {
        return {
            vocabularyListInput: '',
            componentSelect: []
        };
    }
}
</script>

<style scoped>
.container {
}
.btns {
    margin: 5%;
    width: 90%;
}
.select-container {
    margin: 5px;
}
.select {
    max-width: 275px;
}
.text-container {
    margin: 10px 5px;
}
.text-input {
    max-width: 200px;
}
</style>
